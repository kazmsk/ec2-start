'use strict';

//definition library
const aws = require('aws-sdk');
const foreach = require('co-foreach');

//difinition variables
const ec2 = new aws.EC2();

exports.handler = (event, context, callback) => {
  console.log('start function');

  // event params
  console.log(JSON.stringify(event));

  // ec2 nametag list
  const nameTags = event.nameTags;

  console.log('start instance');
  foreach(nameTags, function *(nameTag) {
    // check instance exists
    const reservations = yield describeInstance(nameTag);
    if (reservations.length === 0) {
      console.log('instance none');
    } else {
      const instanceId = reservations[0].Instances[0].InstanceId;
      // start instance
      yield startInstance(instanceId);
    }
  }).then(onEnd).catch(onError);

  // check instance exists
  function describeInstance(nameTag) {
    return new Promise((resolve, reject) => {
      var params = {
        Filters: [
          {
            Name: 'tag-key',
            Values: ['Name']
          },
          {
            Name: 'tag-value',
            Values: [nameTag]
          }
        ]
      };
      ec2.describeInstances(params, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.Reservations);
        }
      });
    });
  }

  // start instance
  function startInstance(instanceId) {
    return new Promise((resolve, reject) => {
      const params = {
        InstanceIds : [instanceId]
      };
      ec2.startInstances(params, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }

  // end
  function onEnd(result) {
    console.log('finish function');
    callback(null, 'succeed');
  }

  // error
  function onError(error) {
    console.log(error, error.stack);
    callback(error, error.stack);
  }
};