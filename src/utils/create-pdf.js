import html2Canvas from 'html2canvas'
import API from '../service/api';
export default function (ref, title = 'pdf', preview = false) {
    if (typeof ref === 'string') ref = document.querySelector(ref);
    html2Canvas(ref, {
        allowTaint: true,
        dpi: '300',
        scale: '2',
        taintTest: false,
        background: '#fff'
    }).then(async (canvas) => {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89;
        let leftHeight = contentHeight;
        let padding = 30;
        let position = padding;
        let imgWidth = 595.28 - padding * 2;
        let imgHeight = (592.28 - padding * 2) / contentWidth * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let PDF = new jsPDF('', 'pt', 'a4');
        if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', padding, padding, imgWidth, imgHeight)
        } else {
            while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', padding, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                if (leftHeight > 0) {
                    PDF.addPage()
                }
            }
        }
        const filename = `${title}.pdf`;
        if (!preview) {
            PDF.save(filename);
        } else {
            const file = new window.File([PDF.output('blob', { filename })], filename);
            const ret = await API.uploadTempPdf(file);
            if (ret.success) {
                window.open(`/pdf?url=${ret.data.url}`);
            }
        }
    })
}