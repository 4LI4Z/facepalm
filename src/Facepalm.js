import React, { Component } from 'react';
import graph from 'fbgraph';
import './Facepalm.css';

class Facepalm extends Component {

  constructor(props) {
    super(props);
    this.state = {acc_tok : null, site : null,
                  commlim : null, postlim : null,
                  comments: [], posts: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addToComments(err, comments) {
    if (err) {
        alert(err.message + " \n @ getting Comments");
    } else {
      var commentsadded = this.state.comments;
      if(comments.comments != null) {
        comments.comments.data.forEach((comment) => commentsadded.push(comment));
        this.setState({comments : commentsadded});
      }
    }
  }
  addToPosts(err, posts) {
    if (err) {
      alert(err.message + " \n @ getting Posts");
    } else {
      this.setState({posts : posts.posts.data})
    }
  }

  getPostsForID(site_id, postlim, acc_tok) {
    if(site_id != null) {
      graph.setAccessToken(acc_tok);
      var paramsforpostings = { fields: "id,name,posts.limit(" + postlim + ")" };
      graph.get(site_id, paramsforpostings, (err, posts) => this.addToPosts(err, posts));
    }
  }
  getCommentsForID(post_id, commlim, acc_tok) {
      if (post_id != null) {
        graph.setAccessToken(acc_tok);
        var paramsforcomments = { fields: "comments.limit(" + commlim + ")" };
        graph.get(post_id, paramsforcomments, (err, comments) => this.addToComments(err, comments));
      }
    }

  handleChange(event) {
    if (event.target.name === "acc_tok_input") {
      this.setState({acc_tok: event.target.value});
    } else if (event.target.name ==="site_input") {
      this.setState({site : event.target.value});
    } else if (event.target.name ==="commlim_input") {
      this.setState({commlim : event.target.value - 0});
    } else if (event.target.name ==="postlim_input") {
      this.setState({ postlim: event.target.value - 0});
    }
  }

  handleSubmit(event) {
    if (this.state.site != null && this.state.acc_tok != null) {
      this.setState({comments : [], posts : []});
      this.getPostsForID(this.state.site, this.state.postlim, this.state.acc_tok);
      setTimeout( () => this.state.posts.forEach((post)=>(this.getCommentsForID(post.id,this.state.commlim, this.state.acc_tok))), 3000);
      console.log(this.state.comments);
      event.preventDefault();
    } else {
      alert("Please input Site and Access Token");
    }
  }

  render() {
    var acc_tok_input = <input type="text" className="Form-Input" name="acc_tok_input" onChange={this.handleChange} />;
    var site_input = <input type="text" className="Form-Input" name="site_input" onChange={this.handleChange} />;
    var commlim_input = <input type="text" className=" Form-Input Form-Input-Number" name="commlim_input" size="10" onChange={this.handleChange} />;
    var postlim_input = <input type="text" className="Form-Input Form-Input-Number" name="postlim_input" size="10" onChange={this.handleChange} />;
    var go_button = <input className="Go-Button" type="submit" name="run_button" value="Go"/>;

    let data = null;
    if (this.state.comments.length != 0) {
      data = <h2> Comments: </h2>;
    } else {
      data = <h2> No data </h2>;
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="Input-Title">
            Access Token: <br />
          </ div>
          {acc_tok_input} <br />
          <div className="Input-Title">
            Site: <br />
          </ div>
          {site_input} <br />
          <div className="Input-Title">
            Comment Limit: <br />
          </ div>
          {commlim_input} <br />
          <div className="Input-Title">
            Post Limit: <br />
          </ div>
          {postlim_input} <br />
          {go_button}
        </form>
        {data}
        <div className="Data">
          {(this.state.comments || []).map(comment => (
            <ul className="Uli">
              <li><b>Name:</b> <a href={"https://www.facebook.com/" + comment.from.id +"/"}> {comment.from.name} </a>
              <br /><b>Time:</b> {comment.created_time}
              <br /><b>Message:</b> <a href={"https://www.facebook.com/" + comment.id +"/"}>{comment.message} </a>
              </li>
            <hr />
            </ul>
          ))}
        </div>
      </ div>
    )
  }
}

export default Facepalm;
