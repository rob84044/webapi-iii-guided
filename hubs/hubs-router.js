const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

// this only runs if the url has /api/hubs in it
router.get('/', async(req, res) => {
    try {
        const hubs = await Hubs.find(req.query);
        res.status(200).json(hubs);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving the hubs',
        });
    }
});

// /api/hubs/:id

router.get('/:id', validateId, async(req, res) => {
    //With validateId Function
    res.status(200).json(req.hub)

    //Without validateId Function

    // try {
    //     const hub = await Hubs.findById(req.params.id);

    //     if (hub) {
    //         res.status(200).json(hub);
    //     } else {
    //         res.status(404).json({ message: 'Hub not found' });
    //     }
    // } catch (error) {
    //     // log error to server
    //     console.log(error);
    //     res.status(500).json({
    //         message: 'Error retrieving the hub',
    //     });
    // }
});

router.post('/', isThereABody, async(req, res) => {
    try {
        const hub = await Hubs.add(req.body);
        res.status(201).json(hub);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error adding the hub',
        });
    }
});

router.delete('/:id', validateId, isThereABody, async(req, res) => {
    try {
        const count = await Hubs.remove(req.params.id);
        if (count > 0) {
            res.status(200).json({ message: 'The hub has been nuked' });
        } else {
            res.status(404).json({ message: 'The hub could not be found' });
        }
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error removing the hub',
        });
    }
});

router.put('/:id', validateId, isThereABody, async(req, res) => {
    try {
        const hub = await Hubs.update(req.params.id, req.body);
        if (hub) {
            res.status(200).json(hub);
        } else {
            res.status(404).json({ message: 'The hub could not be found' });
        }
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error updating the hub',
        });
    }
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get('/:id/messages', isThereABody, validateId, async(req, res) => {
    try {
        const messages = await Hubs.findHubMessages(req.params.id);

        res.status(200).json(messages);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error getting the messages for the hub',
        });
    }
});

// add an endpoint for adding new message to a hub
router.post('/:id/messages', isThereABody, validateId, async(req, res) => {
    const messageInfo = {...req.body, hub_id: req.params.id };

    try {
        const message = await Messages.add(messageInfo);
        res.status(210).json(message);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error getting the messages for the hub',
        });
    }
});

//This function will allow us to validate all the METHOD calls above that require an ID to make it run. Instead of validating each method, this allows for simpler and easier code.

async function validateId(req, res, next) {
    try {
        const { id } = req.params

        const hub = await Hubs.findById(id)

        if (hub) {
            req.hub = hub;
            next()
        } else {
            res.status(404).json({ message: "Id not found" })
        }
    } catch (error) {
        res.status(500).json(error)
    }


}


// middleware that validates the req has a body, add it ot the methods that require a body
async function isThereABody(req, res, next) {
    try {
        const { body } = req.body

        if (body) {
            req.body = body
            next()

        } else {
            res.status(404).json({ message: "Body was not provided" })
        }

    } catch (error) {
        res.status(500).json(error)
    }
}




// A neat router.METHOD code block

// router.get('/', (req, res, next) => {
//   console.log('first handler...');
//   next();
// }, (req, res, next) => {
//   console.log('second handler...');
//   next();
// })

// function handler1(req, res, next) {
//   console.log('handler 1');
//   next();
// }

// function handler2(req, res, next) {
//   console.log('handler 2');
//   next();
// }

// router.get('/', handler1, handler2);
// router.get('/', handler1, handler2);
// router.get('/', handler1, handler2);
// router.get('/', handler1, handler2);
// router.get('/', handler1, handler2);
// router.get('/', handler1, handler2);
// router.get('/', handler1, handler2);

// [handler1, handler]
// router.get('/', []);

module.exports = router;