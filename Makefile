.PHONY: docker-build

repo_owner:=trevrosen
repo_name:=fluxbot
robot_name:=fluxbot
robot_description:="A Hubot to control FluxCD"

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
	kubectl run -i --tty --rm $(repo_name)-debug --image=$(repo_owner)/$(repo_name):latest --restart=Never
