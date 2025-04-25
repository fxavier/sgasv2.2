import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Helper function to handle date and time correctly
const createDateTimeFromStrings = (dateStr: string, timeStr: string) => {
  // If time is in HH:mm format, we need to convert it to a full date-time string
  if (timeStr.match(/^\d{2}:\d{2}$/)) {
    // Combine date and time strings
    return new Date(`${dateStr}T${timeStr}:00`);
  }

  // If it's already a full ISO string, use as is
  return new Date(timeStr);
};

// GET all incident flash reports
export async function GET() {
  try {
    const reports = await db.incidentFlashReport.findMany({
      include: {
        incidents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedReports = reports.map((report) => ({
      id: report.id,
      incidents: report.incidents.map((incident) => ({
        id: incident.id,
        description: incident.description,
      })),
      date_incident: report.dateIncident.toISOString().split('T')[0], // Format as YYYY-MM-DD
      time_incident: report.timeIncident
        .toISOString()
        .split('T')[1]
        .substring(0, 5), // Format as HH:MM
      section: report.section,
      location_incident: report.locationIncident,
      date_reported: report.dateReported.toISOString().split('T')[0],
      supervisor: report.supervisor,
      type: report.type,
      employee_name: report.employeeName,
      subcontrator_name: report.subcontratorName,
      incident_description: report.incidentDescription,
      details_of_injured_person: report.detailsOfInjuredPerson,
      witness_statement: report.witnessStatement,
      preliminary_findings: report.preliminaryFindings,
      recomendations: report.recomendations,
      further_investigation_required: report.furtherInvestigationRequired,
      incident_reportable: report.incidentReportable,
      lenders_to_be_notified: report.lendersToBeNotified,
      author_of_report: report.authorOfReport,
      date_created: report.dateCreated.toISOString().split('T')[0],
      approver_name: report.approverName,
      date_approved: report.dateApproved.toISOString().split('T')[0],
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('Error fetching incident flash reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident flash reports' },
      { status: 500 }
    );
  }
}

// POST create a new incident flash report
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form data:', JSON.stringify(body, null, 2));

    const {
      incidents,
      date_incident,
      time_incident,
      section,
      location_incident,
      date_reported,
      supervisor,
      type,
      employee_name,
      subcontrator_name,
      incident_description,
      details_of_injured_person,
      witness_statement,
      preliminary_findings,
      recomendations,
      further_investigation_required,
      incident_reportable,
      lenders_to_be_notified,
      author_of_report,
      approver_name,
      date_approved,
    } = body;

    // Validate required fields
    if (
      !date_incident ||
      !time_incident ||
      !location_incident ||
      !date_reported ||
      !supervisor ||
      !type ||
      !incident_description ||
      !details_of_injured_person ||
      !recomendations ||
      !further_investigation_required ||
      !incident_reportable ||
      !lenders_to_be_notified ||
      !author_of_report ||
      !approver_name ||
      !date_approved
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process date and time values
    try {
      const incidentDate = createDateTimeFromStrings(date_incident, '00:00');
      const incidentTime = createDateTimeFromStrings(
        date_incident,
        time_incident
      );
      const reportedDate = createDateTimeFromStrings(date_reported, '00:00');
      const approvedDate = createDateTimeFromStrings(date_approved, '00:00');

      console.log('Parsed dates:', {
        incidentDate,
        incidentTime,
        reportedDate,
        approvedDate,
      });
    } catch (error) {
      console.error('Date parsing error:', error);
      return NextResponse.json(
        { error: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    // Check if incidents exist, create if not
    let incidentIds = [];
    if (incidents && incidents.length > 0) {
      for (const incident of incidents) {
        let incidentRecord;

        if (incident.id) {
          // Check if incident exists
          incidentRecord = await db.incidents.findUnique({
            where: { id: incident.id },
          });

          if (!incidentRecord) {
            // Create new incident if not found
            incidentRecord = await db.incidents.create({
              data: {
                description: incident.description,
              },
            });
          }
        } else {
          // Create new incident
          incidentRecord = await db.incidents.create({
            data: {
              description: incident.description,
            },
          });
        }

        incidentIds.push({ id: incidentRecord.id });
      }
    }

    // Create the incident flash report
    const report = await db.incidentFlashReport.create({
      data: {
        dateIncident: createDateTimeFromStrings(date_incident, '00:00'),
        timeIncident: createDateTimeFromStrings(date_incident, time_incident),
        section,
        locationIncident: location_incident,
        dateReported: createDateTimeFromStrings(date_reported, '00:00'),
        supervisor,
        type, // Ensure this matches the Type enum in your schema
        employeeName: type === 'Employee' ? employee_name : null,
        subcontratorName: type === 'Subcontrator' ? subcontrator_name : null,
        incidentDescription: incident_description,
        detailsOfInjuredPerson: details_of_injured_person,
        witnessStatement: witness_statement || null,
        preliminaryFindings: preliminary_findings || null,
        recomendations,
        furtherInvestigationRequired: further_investigation_required as
          | 'Yes'
          | 'No',
        incidentReportable: incident_reportable as 'Yes' | 'No',
        lendersToBeNotified: lenders_to_be_notified as 'Yes' | 'No',
        authorOfReport: author_of_report,
        approverName: approver_name,
        dateApproved: createDateTimeFromStrings(date_approved, '00:00'),
        incidents: {
          connect: incidentIds,
        },
      },
      include: {
        incidents: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedReport = {
      id: report.id,
      incidents: report.incidents.map((incident) => ({
        id: incident.id,
        description: incident.description,
      })),
      date_incident: report.dateIncident.toISOString().split('T')[0],
      time_incident: report.timeIncident
        .toISOString()
        .split('T')[1]
        .substring(0, 5),
      section: report.section,
      location_incident: report.locationIncident,
      date_reported: report.dateReported.toISOString().split('T')[0],
      supervisor: report.supervisor,
      type: report.type,
      employee_name: report.employeeName,
      subcontrator_name: report.subcontratorName,
      incident_description: report.incidentDescription,
      details_of_injured_person: report.detailsOfInjuredPerson,
      witness_statement: report.witnessStatement,
      preliminary_findings: report.preliminaryFindings,
      recomendations: report.recomendations,
      further_investigation_required: report.furtherInvestigationRequired,
      incident_reportable: report.incidentReportable,
      lenders_to_be_notified: report.lendersToBeNotified,
      author_of_report: report.authorOfReport,
      date_created: report.dateCreated.toISOString().split('T')[0],
      approver_name: report.approverName,
      date_approved: report.dateApproved.toISOString().split('T')[0],
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedReport, { status: 201 });
  } catch (error) {
    console.error('Error creating incident flash report:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to create incident flash report: ${errorMessage}` },
      { status: 500 }
    );
  }
}
