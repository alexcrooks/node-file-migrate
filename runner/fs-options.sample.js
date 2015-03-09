/**
 * Options sample for Amazon S3
 */
module.exports = exports = {
  /**
   * We're working with our local file system here.
   */
  type: 'fs',

  /**
   * The absolute path to your uploads directory with a trailing slash.
   *
   * Your getInPath/getOutPath method should provide a path to the file relative
   * to this setting.
   *
   * With this setting as /foo/bar/ and getInPath returning baz/something.jpg,
   * fs will attempt to get the file from /foo/bar/baz/something.jpg.
   */
  absolutePath: '/home/ubuntu/my-app/attachments/',
};
