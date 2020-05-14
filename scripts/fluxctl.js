// Description:
//    Provides access to fluxctl list-images, list-workloads, and release on a whitelist of namespaces
//
// Configuration:
//    FLUXBOT_ALLOWED_NAMESPACES=namespace1,namespace2
//    FLUXBOT_REPO_PREFIX=[ECR URL FRAGMENT OR DOCKER HUB ORG NAME]
//    
//
// Commands:
//    fluxbot workloads [NAMESPACE]
//    fluxbot images [NAMESPACE]
//    fluxbot deploy [NAMESPACE] [DEPLOYMENT_NAME] [IMAGE_REPO_NAME] [IMAGE_TAG]
//
//


module.exports = function(robot) {
  var allowed_namespaces
  const default_namespace = "default" // not really useful


  // FLUXBOT_ALLOWED_NAMESPACES must be set so that commands will execute against only a whitelist of namespaces
  if (process.env.FLUXBOT_ALLOWED_NAMESPACES) {
    allowed_namespaces = process.env.FLUXBOT_ALLOWED_NAMESPACES.split(',')
  }else{
    console.log("FLUXBOT_ALLOWED_NAMESPACES is not set, exiting")
    process.exit(1)
  }

  // FLUX_FORWARD_NAMESPACE must be set so that this bot knows how to talk to its Flux
  if (!process.env.FLUX_FORWARD_NAMESPACE) {
    console.log("FLUX_FORWARD_NAMESPACE is not set, exiting")
    process.exit(1)
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
    args =  ["list-workloads"]

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
    args =  ["list-images"]

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
  //   - match[1] -- namespace name
  //   - match[2] -- workload name with "deployment" assumed
  //   - match[3] -- image name without ECR prefix
  //   - match[4] -- image tag (e.g. 1.2.3)
  return robot.respond(/deploy (.*) (.*) (.*)/i, function(msg) {
    const repoPrefix = process.env.FLUXBOT_REPO_PREFIX;

    const ns           = msg.match[1];
    const workloadName = msg.match[2];
    const imageName    = msg.match[3];
    const imageTag     = msg.match[4];

    const workloadPath  = `${ns}:deployment/${workloadName}`;
    const fullImagePath = `${repoPrefix}/${imageName}:${imageTag}`;

    const args = ["release", `-n ${ns}`, `--workload=${workloadPath}`, `--update-image=${fullImagePath}`];

    this.spawn = require('child_process').spawn;

    msg.send(`Running: fluxctl ${args}`);

    const cmd = this.spawn("fluxctl", args);

    cmd.stdout.on('data', data => {
      msg.send(data)
    });

    cmd.stderr.on('data', data => {
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




