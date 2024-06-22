import {PassThrough} from "stream";
import "dotenv/config";

import {
    TranscribeStreamingClient,
    StartStreamTranscriptionCommand,
    StartStreamTranscriptionCommandInput,
    LanguageCode,
    MediaEncoding,
    StartStreamTranscriptionCommandOutput,
} from "@aws-sdk/client-transcribe-streaming";

const MicrophoneStream = require("microphone-stream").default;

const client = new TranscribeStreamingClient({
    region: "us-west-2",
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // },
});
async function parseResponse(
    response: StartStreamTranscriptionCommandOutput,
    source: string,
) {
    let x = source;
    for await (const event of response.TranscriptResultStream!) {
        if (event.TranscriptEvent) {
            const results = event.TranscriptEvent.Transcript!.Results;

            let transcript = "";
            results!
                .filter(result => !result.IsPartial)
                .map(result => {
                    (result.Alternatives || []).map(alternative => {
                        transcript = alternative
                            .Items!.map(item => item.Content)
                            .join(" ");
                        x += transcript;
                    });
                });
        }
    }
    return x;
}

async function recorder(stream: PassThrough) {
    const params: StartStreamTranscriptionCommandInput = {
        AudioStream: stream,
        ClientId: "client_id",
        LanguageCode: LanguageCode.JA_JP,
        MediaEncoding: MediaEncoding.OGG_OPUS,
        MediaSampleRateHertz: 16000,
    };
    const command = new StartStreamTranscriptionCommand(params);
    let response: StartStreamTranscriptionCommandOutput;
    const res = (async() => {
        try {
            response = await client.send(command);
            return await parseResponse(response);
        } catch (error: any) {
            console.dir(error);
        }
    })();
    console.log(res);
    return res;
}

//async function test_recorder(receiver, userId) {
//  try {
//    fs.readFileSync('./test.opus')
//    fs.createReadStream('./test.opus').pipe(recognizeStream)
//  } catch (error) {
//    console.log(error)
//  }
//}