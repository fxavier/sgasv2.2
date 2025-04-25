import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific incident flash report by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const report = await db.incidentFlashReport.findUnique({
      where: {
        id,
      },
      include: {
        incidents: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Incident flash report not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedReport = {
      id: report.id,
      incidents: report.incidents.map((incident) => ({
        id: incident.id,
        description: incident.description,
      })),
      date_incident: report.dateIncident.toISOString(),
      time_incident: report.timeIncident.toISOString(),
      section: report.section,
      location_incident: report.locationIncident,
      date_reported: report.dateReported.toISOString(),
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
      date_created: report.dateCreated.toISOString(),
      approver_name: report.approverName,
      date_approved: report.dateApproved.toISOString(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedReport);
  } catch (error) {
    console.error('Error fetching incident flash report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident flash report' },
      { status: 500 }
    );
  }
}

// PUT update an incident flash report
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

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

    // Check if the report exists
    const existingReport = await db.incidentFlashReport.findUnique({
      where: {
        id,
      },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Incident flash report not found' },
        { status: 404 }
      );
    }

    // First, disconnect all existing incidents
    await db.incidentFlashReport.update({
      where: { id },
      data: {
        incidents: {
          set: [], // Disconnect all existing connections
        },
      },
    });

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

    // Update the incident flash report
    const report = await db.incidentFlashReport.update({
      where: {
        id,
      },
      data: {
        dateIncident: new Date(date_incident),
        timeIncident: new Date(time_incident),
        section,
        locationIncident: location_incident,
        dateReported: new Date(date_reported),
        supervisor,
        type,
        employeeName: type === 'Employee' ? employee_name : null,
        subcontratorName: type === 'Subcontrator' ? subcontrator_name : null,
        incidentDescription: incident_description,
        detailsOfInjuredPerson: details_of_injured_person,
        witnessStatement: witness_statement,
        preliminaryFindings: preliminary_findings,
        recomendations,
        furtherInvestigationRequired: further_investigation_required,
        incidentReportable: incident_reportable,
        lendersToBeNotified: lenders_to_be_notified,
        authorOfReport: author_of_report,
        approverName: approver_name,
        dateApproved: new Date(date_approved),
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
      date_incident: report.dateIncident.toISOString(),
      time_incident: report.timeIncident.toISOString(),
      section: report.section,
      location_incident: report.locationIncident,
      date_reported: report.dateReported.toISOString(),
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
      date_created: report.dateCreated.toISOString(),
      approver_name: report.approverName,
      date_approved: report.dateApproved.toISOString(),
      created_at: report.createdAt.toISOString(),
      updated_at: report.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedReport);
  } catch (error) {
    console.error('Error updating incident flash report:', error);
    return NextResponse.json(
      { error: 'Failed to update incident flash report' },
      { status: 500 }
    );
  }
}

// DELETE an incident flash report
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the report exists
    const existingReport = await db.incidentFlashReport.findUnique({
      where: {
        id,
      },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Incident flash report not found' },
        { status: 404 }
      );
    }

    // First, disconnect all incidents
    await db.incidentFlashReport.update({
      where: { id },
      data: {
        incidents: {
          set: [], // Disconnect all existing connections
        },
      },
    });

    // Then delete the report
    await db.incidentFlashReport.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting incident flash report:', error);
    return NextResponse.json(
      { error: 'Failed to delete incident flash report' },
      { status: 500 }
    );
  }
}
