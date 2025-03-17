import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import type { Patient } from '../../types/patient';

// Utility function to check if an object has any non-empty values
function hasData(obj: any): boolean {
  if (!obj) return false;
  return Object.values(obj).some(value => 
    value !== null && 
    value !== undefined && 
    value !== '' &&
    value !== false
  );
}

export const generatePatientPDF = async (patients: Patient[], section: 'cardiac' | 'icu' = 'cardiac') => {
  // Create temporary div for rendering
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.fontFamily = "'Noto Sans Georgian', sans-serif";
  tempDiv.style.padding = '20px';
  tempDiv.style.width = '800px';
  document.body.appendChild(tempDiv);

  try {
    // Generate HTML content with consistent styling
    tempDiv.innerHTML = `
      <div style="font-family: 'Noto Sans Georgian', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #1a365d; text-align: center;">
          Patient Summary Report
        </h1>
        <div style="font-size: 12px; color: #666; margin-bottom: 24px; text-align: center;">
          Generated on: ${format(new Date(), 'PPpp')}
        </div>
        ${generateSectionsHTML(patients, section)}
      </div>
    `;

    // Convert to canvas with consistent scaling
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 800,
      height: tempDiv.offsetHeight,
      onclone: (doc) => {
        const link = doc.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;700&display=swap';
        link.rel = 'stylesheet';
        doc.head.appendChild(link);
      }
    });

    // Create PDF with consistent dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
      compress: true
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    const scaleFactor = contentWidth / canvas.width;
    const contentHeight = canvas.height * scaleFactor;

    // Split content across pages if needed
    let remainingHeight = contentHeight;
    let currentPage = 0;

    while (remainingHeight > 0) {
      if (currentPage > 0) {
        pdf.addPage();
      }

      const yPos = -currentPage * pageHeight;
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        yPos + margin,
        contentWidth,
        contentHeight,
        undefined,
        'FAST'
      );

      remainingHeight -= (pageHeight - (2 * margin));
      currentPage++;
    }

    pdf.save(`${section}-patient-report.pdf`);
  } finally {
    document.body.removeChild(tempDiv);
  }
};

function generateSectionsHTML(patients: Patient[], section: string): string {
  if (section === 'cardiac') {
    return generatePatientSummaryHTML(patients[0]);
  } else {
    return generatePatientSummaryHTML(patients[0]);
  }
}

function generatePatientSummaryHTML(patient: Patient): string {
  const sectionStyle = `
    margin-bottom: 24px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
  `;

  const sectionTitleStyle = `
    font-size: 18px;
    font-weight: 600;
    color: #1a365d;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
  `;

  const gridStyle = `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  `;

  const labelStyle = `
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  `;

  const valueStyle = `
    font-size: 14px;
    color: #111827;
    font-weight: 500;
  `;

  return `
    <div style="${sectionStyle}">
      <div style="${sectionTitleStyle}">Basic Information</div>
      <div style="${gridStyle}">
        <div>
          <div style="${labelStyle}">Name</div>
          <div style="${valueStyle}">${patient.name}</div>
        </div>
        ${patient.age ? `
          <div>
            <div style="${labelStyle}">Age</div>
            <div style="${valueStyle}">${patient.age} years</div>
          </div>
        ` : ''}
        <div>
          <div style="${labelStyle}">Diagnosis</div>
          <div style="${valueStyle}">${patient.diagnosis || 'N/A'}</div>
        </div>
        ${patient.sex ? `
          <div>
            <div style="${labelStyle}">Sex</div>
            <div style="${valueStyle}">${patient.sex}</div>
          </div>
        ` : ''}
        <div>
          <div style="${labelStyle}">Status</div>
          <div style="${valueStyle}">${patient.status}</div>
        </div>
        <div>
          <div style="${labelStyle}">Room Number</div>
          <div style="${valueStyle}">${patient.roomNumber}</div>
        </div>
        <div>
          <div style="${labelStyle}">Admission Date</div>
          <div style="${valueStyle}">${format(patient.admissionDate, 'PPpp')}</div>
        </div>
      </div>

      ${patient.comorbidities && patient.comorbidities.length > 0 ? `
        <div style="${sectionTitleStyle}">Comorbidities</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
          ${patient.comorbidities.map(comorbidity => `
            <span style="
              background-color: #e1effe;
              color: #1a365d;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
            ">${comorbidity}</span>
          `).join('')}
        </div>
      ` : ''}

      ${hasData(patient.echoData) ? `
        <div style="${sectionTitleStyle}">Echo Data</div>
        <div style="${gridStyle}">
          ${Object.entries(patient.echoData)
            .filter(([_, value]) => value)
            .map(([key, value]) => `
              <div>
                <div style="${labelStyle}">${key.toUpperCase()}</div>
                <div style="${valueStyle}">${value}</div>
              </div>
            `).join('')}
        </div>
      ` : ''}

      ${hasData(patient.ecgData) ? `
        <div style="${sectionTitleStyle}">ECG Data</div>
        <div style="margin-bottom: 16px;">
          <p style="white-space: pre-wrap; font-size: 14px; color: #111827;">
            ${patient.ecgData.notes}
          </p>
        </div>
      ` : ''}

      ${patient.notes && patient.notes.length > 0 ? `
        <div style="${sectionTitleStyle}">Clinical Notes</div>
        <div style="space-y-4">
          ${patient.notes.map(note => `
            <div style="
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 12px;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 12px;
                color: #6b7280;
              ">
                <span>${note.createdByName || 'Unknown User'}</span>
                <span>${format(note.timestamp, 'PPpp')}</span>
              </div>
              <p style="
                white-space: pre-wrap;
                font-size: 14px;
                color: #111827;
              ">
                ${typeof note.content === 'string' 
                  ? note.content 
                  : typeof note.content === 'object' && 'content' in note.content
                    ? note.content.content
                    : JSON.stringify(note.content)
                }
              </p>
              ${note.reminder ? `
                <div style="
                  margin-top: 8px;
                  font-size: 12px;
                  color: #6b7280;
                ">
                  Reminder: ${format(note.reminder.dueAt, 'PPp')}
                  ${note.reminder.status !== 'pending' ? ` (${note.reminder.status})` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        font-size: 12px;
        color: #6b7280;
      ">
        <p>Last modified: ${format(patient.last_modified_at || new Date(), 'PPpp')}</p>
        ${patient.last_modified_by ? `
          <p>Modified by: ${patient.last_modified_by}</p>
        ` : ''}
      </div>
    </div>
  `;
}