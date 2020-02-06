# Description:
#  Fluxctl commands

module.exports = (robot) ->
  
  #
  # Hardcoded to the ns we're using for all dev-controlled workloads
  # TODO: evolve this to allow arguments when we can figure out how to make those arguments safe
  robot.respond /workloads/i, (msg) ->
    ns = if !process.env.APPLICATION_NAMESPACE then "applications" else process.env.APPLICATION_NAMESPACE

    @exec = require('child_process').exec
    cmd = "fluxctl --k8s-fwd-ns=flux list-workloads -n #{ns}"
    msg.send "Running [#{cmd}]"

    @exec cmd, (error, stdout, stderr) ->
      if error
        msg.send error
        msg.send stderr
      else
        msg.send stdout

  #
  # List images for workloads in the applications namespace
  #
  robot.respond /images/i, (msg) ->
    ns = if !process.env.APPLICATION_NAMESPACE then "applications" else process.env.APPLICATION_NAMESPACE

    @exec = require('child_process').exec
    cmd = "fluxctl --k8s-fwd-ns=flux list-images -n #{ns}"
    msg.send "Running [#{cmd}]"

    @exec cmd, (error, stdout, stderr) ->
      if error
        msg.send error
        msg.send stderr
      else
        msg.send stdout

  #
  # Calls `fluxctl release` to update a given workload to a given image with a given tag
  #   - match[1] -- workload name with "deployment" assumed
  #   - match[2] -- image name without ECR prefix
  #   - match[3] -- image tag (e.g. 1.2.3)
  robot.respond /deploy (.*) (.*) (.*)/i, (msg) ->
    ns = if !process.env.APPLICATION_NAMESPACE then "applications" else process.env.APPLICATION_NAMESPACE
    ecrPrefix = process.env.ECR_PREFIX

    workloadName = msg.match[1]
    imageName    = msg.match[2]
    imageTag     = msg.match[3]

    workloadPath = "#{ns}:deployment/#{workloadName}"
    fullImagePath = "#{ecrPrefix}/#{imageName}:#{imageTag}"

    args = ["release","--k8s-fwd-ns=flux", "-n #{ns}", "--workload=#{workloadPath}", "--update-image=#{fullImagePath}"]

    @spawn = require('child_process').spawn

    msg.send "Running: fluxctl #{args}"

    cmd = @spawn("fluxctl", args)

    cmd.stdout.on 'data', (data) ->
      msg.send data

    cmd.stderr.on 'data', (data) ->
      msg.send data

    cmd.on 'close', (code) ->
      if Number(code) > 0
        msg.send "fluxctl exited with non-zero code: #{code}"
      



