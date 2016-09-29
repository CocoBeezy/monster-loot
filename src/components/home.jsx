import React, { Component } from 'react';
import _ from 'lodash';
import he from 'he';

// Components
import Loading from './loading';

// Styles
require('../../public/styles/home.scss');
require('../../node_modules/hover.css/scss/hover.scss');

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      youtube_url: '',
      videoId: '',
      commentsList: [],
      nextPageToken: null,
      done: false,
      loading: false,
      winner: null
    };
  }

  changeUrl = (event) => {
    const input = event.target.value;
    this.setState({ youtube_url: input });
  }

  getVideoId = () => {
    const { youtube_url } = this.state;
    const re = /watch\?v\=/;
    const pieces = youtube_url.split(re);
    const id = pieces[1];
    this.setState({ videoId: id, loading: true });
    this.loadComments();
  }

  loadComments = () => {
    gapi.client.load('youtube', 'v3').then(() => {
      const options = {
        part: 'snippet,replies',
				videoId: this.state.videoId,
        maxResults: 100,
        pageToken: this.state.nextPageToken
      };
			gapi.client.youtube.commentThreads.list(options)
			.then(response => {
        console.log(response);
        this.setState({ nextPageToken: (response.result.nextPageToken? response.result.nextPageToken: null) });

        this.generateListOfComments(response.result.items);
			});
    });
  }

  generateListOfComments = (items) => {
    const commentsList = items.map((comment, index) => {
      const { snippet } = comment.snippet.topLevelComment;
      let replies = [];
      if(comment.replies) {
        replies = comment.replies.comments.map((reply, index) => {
          return {
            index: index,
            text: reply.snippet.textDisplay,
            author: reply.snippet.authorDisplayName,
            profileImgUrl: reply.snippet.authorProfileImageUrl,
            channelUrl: reply.snippet.authorChannelUrl
          }
        });
      }
      return {
        index: index + this.state.commentsList.length,
        text: snippet.textDisplay,
        author: snippet.authorDisplayName,
        profileImgUrl: snippet.authorProfileImageUrl,
        channelUrl: snippet.authorChannelUrl,
        replies
      };
    });
    let newCommentsList = this.state.commentsList.concat(commentsList);
    this.setState({ commentsList: newCommentsList  });

    if(this.state.nextPageToken) {
      this.loadComments();
    } else {
      this.setState({ done: true, loading: false });
    }
  }

  getWinnerButton = () => {
    const { commentsList, done } = this.state;
    if(commentsList.length !== 0 && done) {
      return (
        <div>
          <button
            type="button"
            className="btn btn-default btn-winner hvr-float-shadow"
            onClick={this.chooseWinner}
          >
            Pick Winner!
          </button>
        </div>
      );
    }
  }

  chooseWinner = () => {
    const winner = _.sample(this.state.commentsList);
    this.setState({ winner });
  }

  getLoadButtonStyle() {
    return {
      display: (this.state.done ? 'none' : 'block')
    };
  }

  displayWinner = () => {
    const  { winner } = this.state;
    if(winner) {

      const replyContent = winner.replies.map((reply, index) => {
        return <div key={`${reply.name}-${index}`} className="ml-winner-container ml-winner-replies">
          <img src={`${reply.profileImgUrl}`}/>
          <a href={`${reply.channelUrl}`}>{`${reply.author}`}</a>
          <br />
          <br />
          <p><strong>{`Reply (${reply.index+1}):`}</strong> {` ${he.decode(reply.text)}`}</p>
          <br />
        </div>
      });

      return (
        <div className="ml-winner-container">
          <img src={`${winner.profileImgUrl}`}/>
          <a href={`${winner.channelUrl}`}>{`${winner.author}`}</a>
          <br />
          <br />
          <p><strong>{`Comment (${winner.index+1}):`}</strong>{` ${he.decode(winner.text)}`}</p>
          <br />
          { replyContent }
        </div>
      );
    }
  }

  render() {
    console.log(this.state.commentsList);
    return (
      <div className="ml-home-component">
        <Loading show={this.state.loading} />
        <div className="container-fluid">
          <div className="col-md-offset-2 col-md-8">
            <div className="row ml-url-row">
              <span>
                <input
                  className="gate"
                  id="youtube_url"
                  type="text"
                  value={this.state.youtube_url}
                  onChange={this.changeUrl}
                  placeholder="Enter Youtube Video URL"
                />
                <label htmlFor="youtube_url">Url</label>
              </span>
            </div>
            <br />
            <br />
            <br />
            <div className="row">
              <button
                style={this.getLoadButtonStyle()}
                className="btn btn-default btn-load hvr-bounce-to-right"
                type="button"
                onClick={this.getVideoId}
              >
                Load Comments
              </button>
              { this.getWinnerButton() }
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="row">
              { this.displayWinner() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
