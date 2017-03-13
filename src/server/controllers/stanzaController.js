import stanzaManager from './../managers/stanzaManager';
import AppUtils from './../utils/appUtils';

const getStanzas = function(req, res) {
    var status = req.params.status;
    var currentPage = req.params.currentPage;

    stanzaManager.load(status, currentPage, function(error, results) {
        if (!error)
            res.json(results);
    });
};

const createStanza = function(req, res) {
    var stanza = req.body;
    stanzaManager.find(stanza.submitter_n_id, function(err, results) {
        if (!err && results.length > 0)
            AppUtils.sendResponse(res, err, 'submitMessage', 'stanza has already created, you cannot create anymore', null);
        else {
            stanzaManager.create(stanza, function(error, submitStatus) {
                console.log('a stanza is created');
                AppUtils.sendResponse(res, error, 'submitMessage', submitStatus, null);
            });
        }
    });

};

const updateStanza = function(req, res) {
    var options = req.body;
    options.approved_by = req.session.userid;

    console.log('update request for stanza (' + options.stanza_id + ') by (' + options.approved_by + ')');

    stanzaManager.update(options, function(error, results) {
        if (!error)
            AppUtils.sendResponse(res, error, 'updated', true, null);
        else
            AppUtils.sendResponse(res, error, 'updated', false, error.message);
    });
};

export default {
    getStanzas: getStanzas,
    createStanza: createStanza,
    updateStanza: updateStanza
};