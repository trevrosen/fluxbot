.PHONY: build run build_and_run push debug

repo_owner:=trevrosen
repo_name:=fluxbot
robot_name:=fluxbot
robot_description:="A Hubot to control FluxCD"

# Namespaces that Fluxbot will allow commands to
allowed_namespaces:="demo,flux"

build_and_run: build
build_and_run: run

run:
	docker run -it \
		-e HUBOT_NAME=$(robot_name) \
		-e HUBOT_DESCRIPTION=$(robot_description) \
		$(repo_owner)/$(repo_name)

build:
	docker build -t $(repo_owner)/$(repo_name):latest .

push:
	docker push $(repo_owner)/$(repo_name):latest

debug:
	run -i --tty --rm $(repo_name)-debug --image=$(repo_owner)/$(repo_name):latest --restart=Never
run_local:
	FLUXBOT_ALLOWED_NAMESPACES=$(allowed_namespaces) ./bin/hubot
