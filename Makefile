repo_owner:=trevrosen
repo_name:=fluxbot
robot_name:=fluxbot
robot_description:="A Hubot to control FluxCD"

# Namespaces that Fluxbot will allow commands to
allowed_namespaces:="demo,applications"

flux_forward_namespace:="flux"

.PHONY: run-local
run-local:
	FLUX_FORWARD_NAMESPACE=$(flux_forward_namespace) FLUXBOT_ALLOWED_NAMESPACES=$(allowed_namespaces) ./bin/hubot

build_and_run: build
build_and_run: run

.PHONY: run
run:
	docker run -it \
		-e HUBOT_NAME=$(robot_name) \
		-e HUBOT_DESCRIPTION=$(robot_description) \
		$(repo_owner)/$(repo_name)

.PHONY: build
build:
	docker build -t $(repo_owner)/$(repo_name):latest .

.PHONY: push
push:
	docker push $(repo_owner)/$(repo_name):latest

