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

const client = new TranscribeStreamingClient({
    region: "us-west-2",
});
async function parseResponse(response: StartStreamTranscriptionCommandOutput) {
    let x = "";
    for await (const event of response.TranscriptResultStream!) {
        if (event.TranscriptEvent) {
            const message = event.TranscriptEvent!;
            const results = event.TranscriptEvent.Transcript!.Results;
            results!
                .filter(result => result.IsPartial === false)
                .map(result => {
                    (result.Alternatives || []).map(alternative => {
                        x += alternative
                            .Items!.map(item => item.Content)
                            .join(" ");
                    });
                });
        }
    }
    return x;
}

export async function recorder(stream: any) {
    const audioStream = async function* () {
        for await (const payloadChunk of stream) {
            yield {
                AudioEvent: {
                    AudioChunk: payloadChunk,
                },
            };
        }
    };
    const params: StartStreamTranscriptionCommandInput = {
        AudioStream: audioStream(),
        LanguageCode: LanguageCode.JA_JP,
        MediaEncoding: MediaEncoding.PCM,
        MediaSampleRateHertz: 16000,
    };
    const command = new StartStreamTranscriptionCommand(params);

    const response = await (async () => {
        try {
            return await client.send(command);
        } catch (error: any) {
            console.dir(error);
        }
    })();
    const res = await (async () => {
        try {
            return await parseResponse(response!);
        } catch (error: any) {
            console.dir(error);
        }
    })();
    console.log(res);
    return res;
}
