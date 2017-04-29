export var typeDefs = [`

scalar Date

enum Status {
    OK
    ERR
}

type StatusResponse {
	message: String
	status:  Status
}

type User {
    id: Int
	name: String
	email: String
}

type Server {
    id: Int
	name: String
    kind: String
	ip: String
}

type Video {
    id: Int
	title: String
	magnetUri: String
	description: String
    sentDate: Date
    user: User
    hash: String
}

input Pagination {
    offset: Int!
    limit: Int!
    server: Int!
}

input UserInput {
    id: Int
	name: String
	email: String
	password: String
}

input ServerInput {
    id: Int
	name: String
	ip: String
    kind: String
}

input VideoInput {
    id: Int
	title: String
	magnetUri: String
	description: String
    user: Int
    hash: String
}

type Query {
    listUsers(pag: Pagination!): [User]
    getUser(id: Int!): User
    getUserByEmail(email: String!): User

    listServers(pag: Pagination!): [Server]
    getServer(id: Int!): Server

    listVideos(pag: Pagination!): [Video]
    getVideo(id: Int!): Video
    listVideosByUserId(userId: Int!, pag: Pagination!): [Video]
    listVideosByfullTextSearch(text: String!, pag: Pagination!): [Video]
}

type Mutation {

    announce(server: ServerInput!, video: VideoInput!): StatusResponse
    register(server: ServerInput!): StatusResponse
    
    createUser(input: UserInput!): User
    createServer(input: ServerInput!): Server
    createVideo(input: VideoInput!): Video

    updateUser(input: UserInput!): User
    updateServer(input: ServerInput!): Server
    updateVideo(input: VideoInput!): Video

    deleteUser(id: Int!): User
    deleteServer(id: Int!): Server
    deleteVideo(id: Int!): Video    
}

schema {
    query: Query
    mutation: Mutation
}
`];