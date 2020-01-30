# fluxbot
A Hubot-based chatbot for driving [FluxCD](https://fluxcd.io) `fluxctl`

## What can this do

**NOW**

* `fluxbot workloads` shows all workloads in the `applications` namespace (on-demand namespace coming soon)

**COMING SOON**

* `fluxbot images` issues `fluxctl list-images -n applications`
* `fluxbot release [WORKLOAD NAME] [IMAGE NAME]` issues `fluxctl release --workload=[WORKLOAD NAME] --update-image=[IMAGE NAME]`

## Development
This builds from the image that the stable Hubot Helm chart uses, adding `fluxctl` and our custom scripts.


