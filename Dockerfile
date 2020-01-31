FROM minddocdev/hubot
USER root
COPY bin/fluxctl /usr/bin
RUN chmod +x /usr/bin/fluxctl

USER hubot
COPY scripts/fluxctl.coffee scripts

ENV HUBOT_NAME "fluxbot"

ENTRYPOINT ["./entrypoint.sh"]
# TODO: make it respect $HUBOT_NAME instead of inserting it as a literatl
CMD ["--name", "fluxbot", "--adapter", "slack"]

# Comment out the above and uncomment the below to run in console mode
#CMD ["--name", "fluxbot"]
