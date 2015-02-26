/**
 * Options sample for Amazon S3
 */
module.exports = exports = {
  /**
   * We're working with S3 here.
   */
  type: 's3',

  /**
   * The access key for an AWS user with GetObject/PutObject access to this
   * bucket (GetObject if being used as a source, PutObject if being used as a
   * destination).
   */
  accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',

  /**
   * The secret access key for an AWS user with GetObject/PutObject access to
   * this bucket (GetObject if being used as a source, PutObject if being used as a
   * destination).
   */
  secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',

  /**
   * The region in which the bucket is located. May be null.
   */
  region: 'us-west-2',

  /**
   * The bucket to fetch from/upload to.
   */
  bucket: 'some-bucket-name',
};
