/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Description:
//  Fluxctl commands

module.exports = function(robot) {
  
  //
  // Hardcoded to the ns we're using for all dev-controlled workloads
  // TODO: evolve this to allow arguments when we can figure out how to make those arguments safe
  robot.respond(/workloads/i, function(msg) {
    const ns = !process.env.APPLICATION_NAMESPACE ? "applications" : process.env.APPLICATION_NAMESPACE;

    this.exec = require('child_process').exec;
    const cmd = `fluxctl --k8s-fwd-ns=flux list-workloads -n ${ns}`;
    msg.send(`Running [${cmd}]`);

    return this.exec(cmd, function(error, stdout, stderr) {
      if (error) {
        msg.send(error);
        return msg.send(stderr);
      } else {
        return msg.send(stdout);
      }
    });
  });

  //
  // List images for workloads in the applications namespace
  //
  robot.respond(/images/i, function(msg) {
    const ns = !process.env.APPLICATION_NAMESPACE ? "applications" : process.env.APPLICATION_NAMESPACE;

    this.exec = require('child_process').exec;
    const cmd = `fluxctl --k8s-fwd-ns=flux list-images -n ${ns}`;
    msg.send(`Running [${cmd}]`);

    return this.exec(cmd, function(error, stdout, stderr) {
      if (error) {
        msg.send(error);
        return msg.send(stderr);
      } else {
        return msg.send(stdout);
      }
    });
  });

  //
  // Calls `fluxctl release` to update a given workload to a given image with a given tag
  //   - match[1] -- workload name with "deployment" assumed
  //   - match[2] -- image name without ECR prefix
  //   - match[3] -- image tag (e.g. 1.2.3)
  return robot.respond(/deploy (.*) (.*) (.*)/i, function(msg) {
    const ns = !process.env.APPLICATION_NAMESPACE ? "applications" : process.env.APPLICATION_NAMESPACE;
    const ecrPrefix = process.env.ECR_PREFIX;

    const workloadName = msg.match[1];
    const imageName    = msg.match[2];
    const imageTag     = msg.match[3];

    const workloadPath = `${ns}:deployment/${workloadName}`;
    const fullImagePath = `${ecrPrefix}/${imageName}:${imageTag}`;

    const args = ["release","--k8s-fwd-ns=flux", `-n ${ns}`, `--workload=${workloadPath}`, `--update-image=${fullImagePath}`];

    this.spawn = require('child_process').spawn;

    msg.send(`Running: fluxctl ${args}`);

    const cmd = this.spawn("fluxctl", args);

    cmd.stdout.on('data', data => msg.send(data));

    cmd.stderr.on('data', data => msg.send(data));

    return cmd.on('close', function(code) {
      if (Number(code) > 0) {
        return msg.send(`fluxctl exited with non-zero code: ${code}`);
      }
    });
  });
};
      



