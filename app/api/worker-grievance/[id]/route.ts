import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific worker grievance by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const grievance = await db.workerGrievance.findUnique({
      where: {
        id,
      },
    });

    if (!grievance) {
      return NextResponse.json(
        { error: 'Worker grievance not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedGrievance = {
      id: grievance.id,
      name: grievance.name,
      company: grievance.company,
      date: grievance.date.toISOString(),
      prefered_contact_method: grievance.preferedContactMethod,
      contact: grievance.contact,
      prefered_language: grievance.preferedLanguage,
      other_language: grievance.otherLanguage,
      grievance_details: grievance.grievanceDetails,
      unique_identification_of_company_acknowlegement:
        grievance.uniqueIdentificationOfCompanyAcknowlegement,
      name_of_person_acknowledging_grievance:
        grievance.nameOfPersonAcknowledgingGrievance,
      position_of_person_acknowledging_grievance:
        grievance.positionOfPersonAcknowledgingGrievance,
      date_of_acknowledgement: grievance.dateOfAcknowledgement.toISOString(),
      signature_of_person_acknowledging_grievance:
        grievance.signatureOfPersonAcknowledgingGrievance,
      follow_up_details: grievance.followUpDetails,
      closed_out_date: grievance.closedOutDate.toISOString(),
      signature_of_response_corrective_action_person:
        grievance.signatureOfResponseCorrectiveActionPerson,
      acknowledge_receipt_of_response: grievance.acknowledgeReceiptOfResponse,
      name_of_person_acknowledging_response:
        grievance.nameOfPersonAcknowledgingResponse,
      signature_of_person_acknowledging_response:
        grievance.signatureOfPersonAcknowledgingResponse,
      date_of_acknowledgement_response:
        grievance.dateOfAcknowledgementResponse.toISOString(),
      created_at: grievance.createdAt.toISOString(),
      updated_at: grievance.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedGrievance);
  } catch (error) {
    console.error('Error fetching worker grievance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch worker grievance' },
      { status: 500 }
    );
  }
}

// PUT update a worker grievance
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const {
      name,
      company,
      date,
      prefered_contact_method,
      contact,
      prefered_language,
      other_language,
      grievance_details,
      unique_identification_of_company_acknowlegement,
      name_of_person_acknowledging_grievance,
      position_of_person_acknowledging_grievance,
      date_of_acknowledgement,
      signature_of_person_acknowledging_grievance,
      follow_up_details,
      closed_out_date,
      signature_of_response_corrective_action_person,
      acknowledge_receipt_of_response,
      name_of_person_acknowledging_response,
      signature_of_person_acknowledging_response,
      date_of_acknowledgement_response,
    } = body;

    // Validate required fields
    if (
      !name ||
      !company ||
      !date ||
      !prefered_contact_method ||
      !contact ||
      !prefered_language ||
      !grievance_details ||
      !unique_identification_of_company_acknowlegement ||
      !name_of_person_acknowledging_grievance ||
      !position_of_person_acknowledging_grievance ||
      !date_of_acknowledgement ||
      !signature_of_person_acknowledging_grievance ||
      !follow_up_details ||
      !closed_out_date ||
      !signature_of_response_corrective_action_person ||
      !acknowledge_receipt_of_response ||
      !name_of_person_acknowledging_response ||
      !signature_of_person_acknowledging_response ||
      !date_of_acknowledgement_response
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the worker grievance exists
    const existingGrievance = await db.workerGrievance.findUnique({
      where: {
        id,
      },
    });

    if (!existingGrievance) {
      return NextResponse.json(
        { error: 'Worker grievance not found' },
        { status: 404 }
      );
    }

    // Update the worker grievance
    const grievance = await db.workerGrievance.update({
      where: {
        id,
      },
      data: {
        name,
        company,
        date: new Date(date),
        preferedContactMethod: prefered_contact_method,
        contact,
        preferedLanguage: prefered_language,
        otherLanguage: other_language,
        grievanceDetails: grievance_details,
        uniqueIdentificationOfCompanyAcknowlegement:
          unique_identification_of_company_acknowlegement,
        nameOfPersonAcknowledgingGrievance:
          name_of_person_acknowledging_grievance,
        positionOfPersonAcknowledgingGrievance:
          position_of_person_acknowledging_grievance,
        dateOfAcknowledgement: new Date(date_of_acknowledgement),
        signatureOfPersonAcknowledgingGrievance:
          signature_of_person_acknowledging_grievance,
        followUpDetails: follow_up_details,
        closedOutDate: new Date(closed_out_date),
        signatureOfResponseCorrectiveActionPerson:
          signature_of_response_corrective_action_person,
        acknowledgeReceiptOfResponse: acknowledge_receipt_of_response,
        nameOfPersonAcknowledgingResponse:
          name_of_person_acknowledging_response,
        signatureOfPersonAcknowledgingResponse:
          signature_of_person_acknowledging_response,
        dateOfAcknowledgementResponse: new Date(
          date_of_acknowledgement_response
        ),
      },
    });

    // Format the response to match frontend expectations
    const formattedGrievance = {
      id: grievance.id,
      name: grievance.name,
      company: grievance.company,
      date: grievance.date.toISOString(),
      prefered_contact_method: grievance.preferedContactMethod,
      contact: grievance.contact,
      prefered_language: grievance.preferedLanguage,
      other_language: grievance.otherLanguage,
      grievance_details: grievance.grievanceDetails,
      unique_identification_of_company_acknowlegement:
        grievance.uniqueIdentificationOfCompanyAcknowlegement,
      name_of_person_acknowledging_grievance:
        grievance.nameOfPersonAcknowledgingGrievance,
      position_of_person_acknowledging_grievance:
        grievance.positionOfPersonAcknowledgingGrievance,
      date_of_acknowledgement: grievance.dateOfAcknowledgement.toISOString(),
      signature_of_person_acknowledging_grievance:
        grievance.signatureOfPersonAcknowledgingGrievance,
      follow_up_details: grievance.followUpDetails,
      closed_out_date: grievance.closedOutDate.toISOString(),
      signature_of_response_corrective_action_person:
        grievance.signatureOfResponseCorrectiveActionPerson,
      acknowledge_receipt_of_response: grievance.acknowledgeReceiptOfResponse,
      name_of_person_acknowledging_response:
        grievance.nameOfPersonAcknowledgingResponse,
      signature_of_person_acknowledging_response:
        grievance.signatureOfPersonAcknowledgingResponse,
      date_of_acknowledgement_response:
        grievance.dateOfAcknowledgementResponse.toISOString(),
      created_at: grievance.createdAt.toISOString(),
      updated_at: grievance.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedGrievance);
  } catch (error) {
    console.error('Error updating worker grievance:', error);
    return NextResponse.json(
      { error: 'Failed to update worker grievance' },
      { status: 500 }
    );
  }
}

// DELETE a worker grievance
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the worker grievance exists
    const existingGrievance = await db.workerGrievance.findUnique({
      where: {
        id,
      },
    });

    if (!existingGrievance) {
      return NextResponse.json(
        { error: 'Worker grievance not found' },
        { status: 404 }
      );
    }

    // Delete the worker grievance
    await db.workerGrievance.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting worker grievance:', error);
    return NextResponse.json(
      { error: 'Failed to delete worker grievance' },
      { status: 500 }
    );
  }
}
