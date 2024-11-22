// // // This is a module worker, so we can use imports (in the browser too!)
// // import pi from "@/utils/pi";
// // // sets up an event listener for message event and extracts number data from it
// // // invokes what functionality is inside callback
// // // executes when imported in main js code
// // addEventListener("message", (event: MessageEvent<number>) => {
// //   postMessage(pi(event.data));
// // });

// // This is a module worker, so we can use imports (in the browser too!)
// import * as ort from 'onnxruntime-web';
// let session: ort.InferenceSession | null = null;

// export type WorkerRequest = {
//     type: string,
//     data: { 
//         // frameData: number[],
//         frameData: ort.Tensor.DataTypeMap['float32'],
//         shape: [number, number, number, number], 
//     } | undefined, 
// };

// export type ReadyMessage = {
//     type: "ready";
// };

// export type ErrorMessage = {
//     type: "error";
//     message: string;
// };

// export type ResultMessage = {
//     type: "result";
//     data: ort.InferenceSession.OnnxValueMapType;
// };

// export type WorkerResponse = ReadyMessage | ErrorMessage | ResultMessage;

// addEventListener("message", async (event: MessageEvent<WorkerRequest>) => {
//     const { type, data } = event.data;
//     if (type === "init") {
//         try {
//             session = await ort.InferenceSession.create(
//                 // './_next/static/chunks/pages/best.onnx', 
//                 '/models/yolo-p12.onnx',
//                 { executionProviders: 
//                     ['webgl'], 
//                     graphOptimizationLevel: 'all'
//                 }
//         );
//             postMessage({ type: "ready" });
//         } catch (error) {
//             const errorMessage = (error as Error).message;
//             postMessage({ type: "error", message: `Failed to initialize model: ${errorMessage}` });
//         }
//     } else if (type === "processFrame" && session) {
//         try {
//             if(!data){
//                 throw Error('No data in process message');
//             }
//             // Convert input frame data to an ONNX tensor
//             const tensor = new ort.Tensor("float32", data.frameData, data.shape);
//             // Run inference
//             const results = await session.run({ input: tensor });
//             // Post inference results back to the main thread
//             postMessage({ type: "result", data: results });
//         } catch (error) {
//             const errorMessage = (error as Error).message;
//             postMessage({ type: "error", message: `Inference failed: ${errorMessage}` });
//         }
//     } else {
//         postMessage({ type: "error", message: "Unrecognized message or session not initialized." });
//     }
// });