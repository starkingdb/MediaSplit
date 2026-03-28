import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import JSZip from 'jszip';

let ffmpeg = null;
let loadPromise = null;

export const initFFmpeg = async (onProgress = () => { }) => {
    if (ffmpeg && ffmpeg.loaded) return ffmpeg;

    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        ffmpeg = new FFmpeg();
        ffmpeg.on('progress', ({ progress }) => {
            onProgress(Math.round(progress * 100));
        });

        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        });

        ffmpeg.loaded = true;
        return ffmpeg;
    })();

    return loadPromise;
};

export const splitMedia = async (file, chunkSize, onProgress) => {
    const ff = await initFFmpeg(onProgress);
    const inputName = `input_${file.name.replace(/\s+/g, '_')}`; // Clean filename spaces for safety

    await ff.writeFile(inputName, await fetchFile(file));

    // Extract extension to use same format output
    const ext = file.name.split('.').pop() || 'mp4';
    const outputPattern = `output_%03d.${ext}`;

    // Execute FFmpeg to split file using stream copy (-c copy) for speed and segment muxer
    await ff.exec([
        '-i', inputName,
        '-c', 'copy',
        '-f', 'segment',
        '-segment_time', chunkSize.toString(),
        '-reset_timestamps', '1',
        outputPattern
    ]);

    // Read generated files
    const files = await ff.listDir('/');
    const segments = [];

    for (const f of files) {
        if (f.name.startsWith('output_') && f.name.endsWith(`.${ext}`)) {
            const data = await ff.readFile(f.name);
            const blob = new Blob([data.buffer], { type: file.type });
            const url = URL.createObjectURL(blob);
            segments.push({
                name: f.name,
                url,
                size: blob.size,
                blob // Keep blob for zipping
            });
            // Clean up memfs to free memory
            await ff.deleteFile(f.name);
        }
    }

    // Clean input
    await ff.deleteFile(inputName);

    return segments;
};

export const createZip = async (segments) => {
    const zip = new JSZip();
    for (const seg of segments) {
        zip.file(seg.name, seg.blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return URL.createObjectURL(zipBlob);
};
