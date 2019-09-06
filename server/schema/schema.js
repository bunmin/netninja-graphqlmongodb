const graphql = require('graphql');
const _ = require('lodash');
const books = require('../models/book');
const authors = require('../models/author');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;


const BookType = new GraphQLObjectType ({
    name : 'Book',
    fields : () => ({
        id: { type : GraphQLID },
        name: { type : GraphQLString },
        genre: { type : GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent,args){
                // console.log(parent);
                // return _.find(authors, { id: parent.authorId });
                return authors.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType ({
    name : 'Author',
    fields : () => ({
        id: { type : GraphQLID },
        name: { type : GraphQLString },
        age: { type : GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return _.filter(books, { authorId: parent.id });
                return books.find({ authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType ({
    name : 'RootQueryType',
    fields : {
        book:{
            type : BookType,
            args: {id: {type:GraphQLID}},
            resolve(parent,args){
                // code to get data form db/other source
                //console.log(typeof(args.id));
                // console.log(parent);
                // return _.find(books,{id:args.id});
                return books.findById(args.id);
            }
        },
        author:{
            type : AuthorType,
            args: {id: {type:GraphQLID}},
            resolve(parent,args){
                // code to get data form db/other source
                //console.log(typeof(args.id));
                // return _.find(authors,{id:args.id});
                return authors.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return books;
                return books.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                // return authors;
                return authors.find({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent,args){
                let author = new authors({
                    name: args.name,
                    age: args.age
                });

                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent,args){
                let book = new books({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});