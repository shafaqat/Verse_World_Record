import dbController from './../controllers/dbController';
var DbConnection = dbController.connection;

class stanzaManager {
    load(status, currentPage, search_query, callback) {
        var offset = currentPage * 50;
        var stanzasLimit = 50;
        search_query = (!search_query) ? ("'%%'") : ("'%" + search_query + "%'");

        var query = 'SELECT stanza_text, submitter_name, stanzas.id FROM stanzas, submitters, statuses WHERE stanzas.submitter_id = submitters.submitter_id AND stanzas.status_id = statuses.id AND stanza_text LIKE ' + search_query + ' AND statuses.type = ? LIMIT ? OFFSET ?';

        DbConnection.query(query, [status, stanzasLimit, offset], function(err, results) {
            query = 'SELECT COUNT(*) FROM stanzas, statuses WHERE stanzas.status_id = statuses.id AND statuses.type = ? AND stanza_text LIKE ' + search_query;
            if (!err) {
                DbConnection.query(query, status, function(err, row_count) {
                    results.push(row_count);
                    console.log(results.length + ' sending records of type \"' + status + '\"');
                    return callback(null, results);
                });
            } else
                console.log('err:', err);

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
        DbConnection.query('Insert INTO submitters (submitter_name, submitter_n_id, twitter_account, mobile_number) values(?,?,?,?)', [stanza.submitter_name, stanza.submitter_n_id, stanza.twitter_account, stanza.mobile_number], function(results) {

            DbConnection.query('SELECT * FROM submitters WHERE submitter_n_id= ?', stanza.submitter_n_id, function(err, results) {
                if (!err) {
                    DbConnection.query('INSERT INTO stanzas (stanza_text, submitter_id) values(?,?)', [stanza.stanza_text, results[0].submitter_id], function(results) {
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

        var queryChunk = (options.update_behavior == 'pending approval') ? 'edited_by= ?' : 'approved_by=?';

        DbConnection.query('UPDATE stanzas, statuses SET status_id= statuses.id, ' + queryChunk + ', stanza_text=? WHERE stanzas.id=? AND statuses.type=?', [options.approved_by, options.stanza_text, options.stanza_id, options.update_behavior], callback);
    }
}

const instance = new stanzaManager();
export default instance;