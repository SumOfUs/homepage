FROM circleci/ruby:2.4.1-node

RUN sudo apt-get update && sudo apt-get install -y awscli
RUN sudo apt-get install apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt-get update && sudo apt-get install yarn
