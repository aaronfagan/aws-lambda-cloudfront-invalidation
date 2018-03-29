'use strict';

// CONFIGURATION //////////////////////////////////////////////
var CloudFrontID = 'DISTRIBUTION ID';
///////////////////////////////////////////////////////////////

let aws = require('aws-sdk');
let s3 = new aws.S3();
let cloudfront = new aws.CloudFront();

// S3
exports.handler = (event, context, callback) => {
	const bucket = event.Records[0].s3.bucket.name;
	const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
// Cloudfront
	params = {
		DistributionId: CloudFrontID,
		InvalidationBatch: {
			CallerReference: new Date().getTime().toString(),
			Paths: {
				Quantity: 1,
				Items: [
					'/'+key,
				]
			}
		}
	};
	cloudfront.createInvalidation(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
			message = 'ERROR: Failed to invalidate object: s3://'+bucket+'/'+key;
			console.log(message);
		} else {
			message = 'Object invalidated successfully: s3://'+bucket+'/'+key;
			console.log(message);
		}
	});
};