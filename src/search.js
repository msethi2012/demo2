import React, {Component} from 'react';
import {Query} from 'react-apollo'
import {gql} from 'apollo-boost';
import SearchResults from './search-results';

const searchQuery = gql`
  query repoSearch($queryString:String!,$len:Int!){
    search(first:$len,type:REPOSITORY,query:$queryString){
      nodes{
        ...on Repository{
          name
          id
          stargazers {totalCount}
          }
        }
     }
  }

`;

class Search extends Component {

    state = {
        userName: "",
        project: "",
        token: "876487a587e4f79ef137e7f4513609bc27d34986",
        results: null,
    }

    handleChange = (e) => {
        let name = e.target.name;
        let self = this;
        switch (name) {
            case "userName":
                this.setState({
                    userName: e.target.value
                })
                break;
            case "project":
                this.setState({
                    project: e.target.value
                })
                break;
            case "token":
                this.setState({
                    token: e.target.value
                })
                break;

            default:
            // code block
        }
        console.log(this.state);
    }

    fecthMore = (fetchMore, data) => {
        let searchString = {queryString: `${this.state.search} stars:>3000`, len: 10}
        fetchMore({
            variables: {...searchString, len: data.search.nodes.length + 10},
            updateQuery: (prev, {fetchMoreResult}) => {
                if (!fetchMoreResult) {
                    console.log(this.state.over)
                    return prev
                }
                return {...prev, ...fetchMoreResult};
            }
        })
    }
    handleClick = async () => {

        let searchString = {queryString: `${this.state.search} stars:>3000`, len: 10}

        let results = <Query query={searchQuery} variables={searchString}>
            {({data, loading, error, fetchMore}) => {
                if (loading) return <p>loading...</p>
                if (error) return <p>{error.message}</p>
                else {
                    return (
                        <div>
                            <SearchResults data={data}/>
                            {data.search.nodes.length > 1 &&
                            <button onClick={() => this.fecthMore(fetchMore, data)}>
                                Fetch more</button>
                            }

                        </div>
                    )
                }
            }}
        </Query>

        this.setState({
            results
        })
    }

    render() {
        return (
            <div className="search">
                <h3>Github Token</h3>
                <input type="text" name="token" onChange={this.handleChange}
                       onKeyUp={(e) => {
                           if (e.keyCode === 13) {
                               this.handleClick()
                               return false
                           }
                       }}
                       value={this.state.token}
                       placeholder="token"/>

                <h3>Github Username</h3>
                <input type="text" name="userName" onChange={this.handleChange}
                       onKeyUp={(e) => {
                           if (e.keyCode === 13) {
                               this.handleClick()
                               return false
                           }
                       }}
                       value={this.state.userName}
                       placeholder="Username"/>

                <h3>Github Project/Repo</h3>
                <input type="text" name="project" onChange={this.handleChange}
                       onKeyUp={(e) => {
                           if (e.keyCode === 13) {
                               this.handleClick()
                               return false
                           }
                       }}
                       value={this.state.project}
                       placeholder="Project"/>
                <h3></h3>

                <button
                    onClick={this.handleClick}
                    disabled={!this.state.token  || !this.state.project || !this.state.userName}
                >Search
                </button>
                <div className="search-results">
                    {this.state.results && this.state.results}
                </div>
            </div>
        )
    }
}

export default Search