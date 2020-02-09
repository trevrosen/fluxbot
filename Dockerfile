FROM minddocdev/hubot
USER root
RUN apk add curl
RUN curl -Lo /usr/bin/fluxctl https://github.com/fluxcd/flux/releases/download/1.18.0/fluxctl_linux_amd64
RUN chmod +x /usr/bin/fluxctl

USER hubot
COPY scripts/fluxctl.js scripts

ENV HUBOT_NAME "fluxbot"

ENTRYPOINT ["./entrypoint.sh"]
CMD ["--name", "fluxbot", "--adapter", "slack"]
