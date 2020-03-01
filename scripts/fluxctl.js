// Description:
//    Provides access to fluxctl list-images, list-workloads, and release on a whitelist of namespaces
//
// Configuration:
//    FLUXBOT_ALLOWED_NAMESPACES=namespace1,namespace2
//    
//
// Commands:
//    fluxbot workloads [NAMESPACE]
//    fluxbot images [NAMESPACE]
//    fluxbot deploy [NAMESPACE] [DEPLOYMENT_NAME] [IMAGE_REPO_NAME] [IMAGE_TAG]
//
module.exports = function(robot) {
  var allowed_namespaces
  const default_namespace = "default" // not really useful

  // All commands will respect a whitelist of namespaces from env
  if (process.env.FLUXBOT_ALLOWED_NAMESPACES) {
    allowed_namespaces = process.env.FLUXBOT_ALLOWED_NAMESPACES.split(',')
  }else{
    allowed_namespaces = default_namespace
  }


  //
  // Returns the namespaces that this Fluxbot will deal with
  //
  robot.respond(/list namespaces/i, function(msg) {
    msg.send(typeof(allowed_namespaces))
  })

  //
  // workloads provides all workloads in the given namespace
  //
  robot.respond(/workloads\s*(\w+)?$/i, function(msg) {
    args =  ["--k8s-fwd-ns=flux", "list-workloads"]

    var namespace = msg.match[1]

    if (namespace != undefined) {
      if (allowed_namespaces.includes(namespace)) {
        args.push("-n")
        args.push(`${msg.match[1]}`)
      }else{
        msg.send(`Namespace "${namespace}" is not managed by this Fluxbot`)
        return
      }    
    }else{
      msg.send("Usage: 'workloads [NAMESPACE]'")
      return
    }


    this.spawn = require('child_process').spawn;
    msg.send(`Running [${args}]`);

    const cmd = this.spawn("fluxctl", args);

    cmd.stdout.on('data', data => {
      msg.send(data)
    });

    cmd.stderr.on('data', data => {
      msg.send(data)
    });

    return cmd.on('close', function(code) {
      if (Number(code) > 0) {
        return msg.send(`fluxctl exited with non-zero code: ${code}`);
      }
    });

  });

  //
  // List images for workloads in the given namespace
  //
  robot.respond(/images\s*(\w+)?$/i, function(msg) {
    args =  ["--k8s-fwd-ns=flux", "list-images"]

    var namespace = msg.match[1]

    if (namespace != undefined) {
      if (allowed_namespaces.includes(namespace)) {
        args.push("-n")
        args.push(`${msg.match[1]}`)
      }else{
        msg.send(`Namespace "${namespace}" is not managed by this Fluxbot`)
        return
      }    
    }else{
      msg.send("Usage: 'images [NAMESPACE]'")
      return
    }


    this.spawn = require('child_process').spawn;
    msg.send(`Running [${args}]`);

    const cmd = this.spawn("fluxctl", args);

    cmd.stdout.on('data', data => {
      msg.send(data)
    });

    cmd.stderr.on('data', data => {
      msg.send(data)
    });

    return cmd.on('close', function(code) {
      if (Number(code) > 0) {
        return msg.send(`fluxctl exited with non-zero code: ${code}`);
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

    cmd.stdout.on('data', data => {
      console.out("in stdout")
      msg.send(data)
    });

    cmd.stderr.on('data', data => {
      console.out("in stderr")
      msg.send(data)
    });

    return cmd.on('close', function(code) {
      console.log(`Exit was ${code}`)
      if (Number(code) > 0) {
        return msg.send(`fluxctl exited with non-zero code: ${code}`);
      }
    });
  });
};




