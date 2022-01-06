// package: 
// file: game/tutorial.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class CompleteTutorialRequest extends jspb.Message { 
    getTutorialid(): string;
    setTutorialid(value: string): CompleteTutorialRequest;
    getUserid(): string;
    setUserid(value: string): CompleteTutorialRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompleteTutorialRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CompleteTutorialRequest): CompleteTutorialRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompleteTutorialRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompleteTutorialRequest;
    static deserializeBinaryFromReader(message: CompleteTutorialRequest, reader: jspb.BinaryReader): CompleteTutorialRequest;
}

export namespace CompleteTutorialRequest {
    export type AsObject = {
        tutorialid: string,
        userid: string,
    }
}
