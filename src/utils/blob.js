
export function URLToDataURL(url) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.crossOrigin = "";
        // img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);
            const dataURL = canvas.toDataURL();
            resolve(dataURL)
        }
        img.onerror = (error => {
            console.log(error);
            reject('');
        })
    })
}

export function dataURLtoFile(dataurl, filename = 'FILE') {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export async function URLToFile(url, filename) {
    try {
        const dataURL = await URLToDataURL(url);
        if (dataURL) {
            return dataURLtoFile(dataURL, filename);
        }
    } catch (error) {
        console.log(error);
    }
}