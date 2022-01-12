// package: 
// file: game/tutorial.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as game_tutorial_pb from "../game/tutorial_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface ITutorialService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    completeTutorial: ITutorialService_ICompleteTutorial;
}

interface ITutorialService_ICompleteTutorial extends grpc.MethodDefinition<game_tutorial_pb.CompleteTutorialRequest, google_protobuf_empty_pb.Empty> {
    path: "/Tutorial/CompleteTutorial";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<game_tutorial_pb.CompleteTutorialRequest>;
    requestDeserialize: grpc.deserialize<game_tutorial_pb.CompleteTutorialRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const TutorialService: ITutorialService;

export interface ITutorialServer {
    completeTutorial: grpc.handleUnaryCall<game_tutorial_pb.CompleteTutorialRequest, google_protobuf_empty_pb.Empty>;
}

export interface ITutorialClient {
    completeTutorial(request: game_tutorial_pb.CompleteTutorialRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    completeTutorial(request: game_tutorial_pb.CompleteTutorialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    completeTutorial(request: game_tutorial_pb.CompleteTutorialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class TutorialClient extends grpc.Client implements ITutorialClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public completeTutorial(request: game_tutorial_pb.CompleteTutorialRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public completeTutorial(request: game_tutorial_pb.CompleteTutorialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public completeTutorial(request: game_tutorial_pb.CompleteTutorialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
