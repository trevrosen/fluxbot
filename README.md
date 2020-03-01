# fluxbot
A Hubot-based chatbot for driving [FluxCD](https://fluxcd.io)'s `fluxctl`

## Project Status
This is a WORK IN PROGRESS. There's currently no tests or CI. The code is dumb at the moment. It will get better over time, but you may never love it.

## Why does this exist
To allow Kubernetes admins to provide a "chat ops with guardrails" functionality to developers who need control over which image a workload is running at a given time but who can't/shouldn't access other things in the cluster.

## What can this do

* `fluxbot workloads [NAMESPACE]` shows all workloads in the namespace
* `fluxbot images [NAMESPACE]` issues `fluxctl list-images -n [NAMESPACE]`
* `fluxbot deploy [NAMESPACE] [WORKLOAD NAME] [IMAGE PATH] [IMAGE TAG]` issues an opinionated `fluxctl release`

## Development

### Prerequisite
* You need NPM. On macOS this is easiest as `brew install npm`
* `npm install generator-hubot yo`
* `yo hubot`


### Hubot Dev
* This builds from the image that the stable Hubot Helm chart uses, adding `fluxctl` and our custom scripts.
* `fluxctl` is currently vendor'd in here. That will change later.
* Yeoman install artifacts are ignored by Git, but they're part of the dev workflow. To hack on the scripts:
	* `yo hubot` sets this up as a fully fledged Hubot project (this is done in the Dockerfile otherwise)	
	* `bin/hubot` will put you into the "console" adapter for Hubot and allow you to run commands against the `fluxctl` bin in your $PATH against your current K8s context.


