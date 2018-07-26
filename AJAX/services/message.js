

const messages = [];

function findMessage(id){
	const err = null;
	if (typeof id === 'undefined'){
		err = new Error('id is undefined');
	}

	let index;
	const message = messages.find((el, ind) => {
		if (el.id === id){
			index = ind;
			return true;
		} else {
			return false;
		}
	});
	return {message, index, err};
}







module.exports = {
	findAll: (callback) => {
		callback(null, messages);
	},

	findOne: (id, callback) => {
		const {err, message} = findMessage(id);
		callback(err, message);
	},

	add: (message, callback) => {
		if (typeof message.id !== 'undefined'){
			messages.push(message);
			callback(null);
		} else {
			callback(new Error('message doesnt have id'));
		}
	},

	findOneAndDelete: (id, callback) => {
		let {err, user, index} = findMessage(id);
		if (typeof index !== 'undefined'){
			messages.splice(index, 1);
		} else {
			err = new Error('no users with such index');
		}
		callback(err);
	},

	findOneAndUpdate: (id, message, callback) => {
		const {err, index} = findMessage(id);
		messages[index] = Object.assign(messages[index], message);
		callback(err);
	}
};