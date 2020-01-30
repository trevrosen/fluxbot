# Description:
#  Fluxctl commands

module.exports = (robot) ->
  
  #
  # Hardcoded to the ns we're using for all dev-controlled workloads
  # TODO: evolve this to allow arguments when we can figure out how to make those arguments safe
  robot.respond /workloads/i, (msg) ->
    @exec = require('child_process').exec
    ns = "applications"

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
    @exec = require('child_process').exec
    ns = "applications"

    cmd = "fluxctl --k8s-fwd-ns=flux list-images -n #{ns}"
    msg.send "Running [#{cmd}]"

    @exec cmd, (error, stdout, stderr) ->
      if error
        msg.send error
        msg.send stderr
      else
        msg.send stdout
