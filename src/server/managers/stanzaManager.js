import dbController from './../controllers/dbController';
var DbConnection = dbController.connection;

class stanzaManager {
    load(status, currentPage, search_query, callback) {
        search_query = (!search_query) ? ("'%%'") : ("'%" + search_query + "%'");

        var sort_type = (status == 'published') ? 'ASC' : 'DESC';

        var query = 'SELECT COUNT(*) FROM stanzas, statuses WHERE stanzas.status_id = statuses.id AND statuses.type = ? AND stanza_text LIKE ' + search_query;
        DbConnection.query(query, status, function(err, row_count) {
            row_count = row_count[0]['COUNT(*)'];
            var stanzasLimit = Math.ceil(row_count / 1000) * 100;
            var offset = currentPage * stanzasLimit;

            if (!err) {
                query = 'SELECT stanza_text, submitter_name, stanzas.id FROM stanzas, submitters, statuses WHERE stanzas.submitter_id = submitters.submitter_id AND stanzas.status_id = statuses.id AND stanza_text LIKE ' + search_query + ' AND statuses.type = ? ORDER BY stanzas.updated_at ' + sort_type + ' LIMIT ? OFFSET ?';

                DbConnection.query(query, [status, stanzasLimit, offset], function(err, results) {
                    results.push(row_count);

                    console.log((results.length - 1) + ' records from ' + offset + ' to ' + (offset + stanzasLimit) + ' sending records of type \"' + status + '\"');
                    return callback(null, results);
                });
            } else console.log('err:', err);
        });
    }

    find(submitter_n_id, callback) {
        DbConnection.query('SELECT * FROM submitters WHERE submitter_n_id= ?', submitter_n_id, function(err, results) {
            if (!err) {
                return callback(null, results);
            } else
                console.log('err:', err);
        });
    }

    create(stanza, callback) {
        var stanza_creation_time = new Date();
        DbConnection.query('Insert INTO submitters (submitter_name, submitter_n_id, twitter_account, mobile_number) values(?,?,?,?)', [stanza.submitter_name, stanza.submitter_n_id, stanza.twitter_account, stanza.mobile_number], function(results) {

            DbConnection.query('SELECT * FROM submitters WHERE submitter_n_id= ?', stanza.submitter_n_id, function(err, results) {
                if (!err) {
                    DbConnection.query('INSERT INTO stanzas (stanza_text, submitter_id, updated_at) values(?,?,?)', [stanza.stanza_text, results[0].submitter_id, stanza_creation_time], function(results) {
                        if (results === null)
                            callback(null, 'stanza submitted for approval, after approval, will be available to the public');
                        else
                            callback(null, 'stanza not submitted');
                    });
                } else
                    console.log('err:', err);
            });

        });
    }

    update(options, callback) {

        var queryChunk = (options.update_behavior == 'pending approval') ? 'edited_by= ?' : 'approved_or_rejected_by=?';

        var stanza_update_time = new Date();

        DbConnection.query('UPDATE stanzas, statuses SET status_id= statuses.id, ' + queryChunk + ', stanza_text=?, updated_at=? WHERE stanzas.id=? AND statuses.type=?', [options.approved_by, options.stanza_text, stanza_update_time, options.stanza_id, options.update_behavior], callback);
    }
}

const instance = new stanzaManager();
export default instance;