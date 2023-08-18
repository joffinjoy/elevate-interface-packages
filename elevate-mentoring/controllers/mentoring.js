const createProfile = (responses, body) => {
	console.log('CREATE PROFILE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	console.log('BODY', body);
	console.log('responses', responses);
	return {
		string: 'Response from Mentoring Service',
	};
};

const forgotPassword = (req, res) => {
	res.status(200).send({ data: 'Happy from get' });
};

mentoringController = {
	createProfile,
	forgotPassword,
};

module.exports = mentoringController;
