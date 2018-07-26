const router = require('express').Router();
const userService = require('../../services/user');

router.get('/', (req, res, next) => {
	userService.findAll((err, data) => {
		if (!err){
			res.data = data;
			res.json(res.data);
		} else {
			res.status(400);
			res.end();
		}
	});
});

router.get('/:id', (req, res, next) => {
	userService.findOne(Number(req.params.id), (err, data) => {
		if (!err){
			res.data = data;
			res.json(res.data);
		} else {
			res.status(400);
			res.end();
		}
	});
});


router.post('/', (req, res, next) => {
	const obj = req.body;
	userService.add(obj, (err, data) => {
        if(!err){
            res.status(200).end();
        }else{
            res.status(400).end();
        }
	});
});


router.delete('/:id', (req, res, next) => {
	userService.findOneAndDelete(Number(req.params.id), (err, data) => {
		if (!err){
			res.json(res.data);
		} else {
			res.status(400);
			res.end();
		}
	});
});

router.put('/:id', (req, res, next) => {
	const obj = req.body;
	userService.findOneAndUpdate(Number(req.params.id), obj, (err, data) => {
		if (!err){
			res.json(res.data);
		} else {
			res.status(400);
			res.end();
		}
	});
	
});

module.exports = router;