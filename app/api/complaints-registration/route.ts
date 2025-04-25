import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all complaint and claim records
export async function GET() {
  try {
    const complaints = await db.complaintAndClaimRecord.findMany({
      include: {
        photosAndDocumentsProvingClosure: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedComplaints = complaints.map((complaint) => ({
      id: complaint.id,
      number: complaint.number,
      date_occurred: complaint.dateOccurred.toISOString(),
      local_occurrence: complaint.localOccurrence,
      how_occurred: complaint.howOccurred,
      who_involved: complaint.whoInvolved,
      report_and_explanation: complaint.reportAndExplanation,
      registered_date: complaint.registeredDate.toISOString(),
      claim_local_occurrence: complaint.claimLocalOccurrence,
      complaintant_gender: complaint.complaintantGender,
      complaintant_age: complaint.complaintantAge,
      anonymous_complaint: complaint.anonymousComplaint,
      telephone: complaint.telephone,
      email: complaint.email,
      complaintant_address: complaint.complaintantAddress,
      complaintant_accepted: complaint.complaintantAccepted,
      action_taken: complaint.actionTaken,
      complaintant_notified: complaint.complaintantNotified,
      notification_method: complaint.notificationMethod,
      closing_date: complaint.closingDate.toISOString(),
      claim_category: complaint.claimCategory,
      other_claim_category: complaint.otherClaimCategory,
      inspection_date: complaint.inspectionDate.toISOString(),
      collected_information: complaint.collectedInformation,
      resolution_type: complaint.resolutionType,
      resolution_date: complaint.resolutionDate.toISOString(),
      resolution_submitted: complaint.resolutionSubmitted,
      corrective_action_taken: complaint.correctiveActionTaken,
      involved_in_resolution: complaint.involvedInResolution,
      complaintant_satisfaction: complaint.complaintantSatisfaction,
      photos_and_documents_proving_closure:
        complaint.photosAndDocumentsProvingClosure.map((doc) => ({
          id: doc.id,
          photo: doc.photo,
          document: doc.document,
          createdBy: doc.createdBy,
          created_at: doc.createdAt.toISOString(),
          updated_at: doc.updatedAt.toISOString(),
        })),
      resources_spent: Number(complaint.resourcesSpent),
      number_of_days_since_received_to_closure:
        complaint.numberOfDaysSinceReceivedToClosure,
      monitoring_after_closure: complaint.monitoringAfterClosure,
      monitoring_method_and_frequency: complaint.monitoringMethodAndFrequency,
      follow_up: complaint.followUp,
      involved_institutions: complaint.involvedInstitutions,
      suggested_preventive_actions: complaint.suggestedPreventiveActions,
      created_at: complaint.createdAt.toISOString(),
      updated_at: complaint.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedComplaints);
  } catch (error) {
    console.error('Error fetching complaint and claim records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint and claim records' },
      { status: 500 }
    );
  }
}

// POST create a new complaint and claim record
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      number,
      date_occurred,
      local_occurrence,
      how_occurred,
      who_involved,
      report_and_explanation,
      claim_local_occurrence,
      complaintant_gender,
      complaintant_age,
      anonymous_complaint,
      telephone,
      email,
      complaintant_address,
      complaintant_accepted,
      action_taken,
      complaintant_notified,
      notification_method,
      closing_date,
      claim_category,
      other_claim_category,
      inspection_date,
      collected_information,
      resolution_type,
      resolution_date,
      resolution_submitted,
      corrective_action_taken,
      involved_in_resolution,
      complaintant_satisfaction,
      photos_and_documents_proving_closure,
      resources_spent,
      number_of_days_since_received_to_closure,
      monitoring_after_closure,
      monitoring_method_and_frequency,
      follow_up,
      involved_institutions,
      suggested_preventive_actions,
    } = body;

    // Validate required fields
    if (
      !number ||
      !date_occurred ||
      !local_occurrence ||
      !how_occurred ||
      !who_involved ||
      !report_and_explanation ||
      !claim_local_occurrence ||
      !complaintant_gender ||
      !complaintant_age ||
      !anonymous_complaint ||
      !telephone ||
      !complaintant_address ||
      !complaintant_accepted ||
      !action_taken ||
      !notification_method ||
      !closing_date ||
      !claim_category ||
      !inspection_date ||
      !collected_information ||
      !resolution_type ||
      !resolution_date ||
      !resolution_submitted ||
      !corrective_action_taken ||
      !involved_in_resolution ||
      !complaintant_satisfaction ||
      !number_of_days_since_received_to_closure ||
      !monitoring_after_closure ||
      !monitoring_method_and_frequency ||
      !follow_up ||
      !suggested_preventive_actions
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if a complaint with the same number already exists
    const existingComplaint = await db.complaintAndClaimRecord.findUnique({
      where: {
        number,
      },
    });

    if (existingComplaint) {
      return NextResponse.json(
        {
          error: 'A complaint and claim record with this number already exists',
        },
        { status: 400 }
      );
    }

    // Create the complaint and claim record
    const complaint = await db.complaintAndClaimRecord.create({
      data: {
        number,
        dateOccurred: new Date(date_occurred),
        localOccurrence: local_occurrence,
        howOccurred: how_occurred,
        whoInvolved: who_involved,
        reportAndExplanation: report_and_explanation,
        claimLocalOccurrence: claim_local_occurrence,
        complaintantGender: complaintant_gender,
        complaintantAge: complaintant_age,
        anonymousComplaint: anonymous_complaint,
        telephone: telephone,
        email: email,
        complaintantAddress: complaintant_address,
        complaintantAccepted: complaintant_accepted,
        actionTaken: action_taken,
        complaintantNotified: complaintant_notified,
        notificationMethod: notification_method,
        closingDate: new Date(closing_date),
        claimCategory: claim_category,
        otherClaimCategory: other_claim_category || '',
        inspectionDate: new Date(inspection_date),
        collectedInformation: collected_information,
        resolutionType: resolution_type,
        resolutionDate: new Date(resolution_date),
        resolutionSubmitted: resolution_submitted,
        correctiveActionTaken: corrective_action_taken,
        involvedInResolution: involved_in_resolution,
        complaintantSatisfaction: complaintant_satisfaction,
        resourcesSpent: resources_spent || 0,
        numberOfDaysSinceReceivedToClosure:
          number_of_days_since_received_to_closure,
        monitoringAfterClosure: monitoring_after_closure,
        monitoringMethodAndFrequency: monitoring_method_and_frequency,
        followUp: follow_up,
        involvedInstitutions: involved_institutions,
        suggestedPreventiveActions: suggested_preventive_actions,
        photosAndDocumentsProvingClosure: {
          connect: photos_and_documents_proving_closure
            ? photos_and_documents_proving_closure.map((doc: any) => ({
                id: doc.id,
              }))
            : [],
        },
      },
      include: {
        photosAndDocumentsProvingClosure: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedComplaint = {
      id: complaint.id,
      number: complaint.number,
      date_occurred: complaint.dateOccurred.toISOString(),
      local_occurrence: complaint.localOccurrence,
      how_occurred: complaint.howOccurred,
      who_involved: complaint.whoInvolved,
      report_and_explanation: complaint.reportAndExplanation,
      registered_date: complaint.registeredDate.toISOString(),
      claim_local_occurrence: complaint.claimLocalOccurrence,
      complaintant_gender: complaint.complaintantGender,
      complaintant_age: complaint.complaintantAge,
      anonymous_complaint: complaint.anonymousComplaint,
      telephone: complaint.telephone,
      email: complaint.email,
      complaintant_address: complaint.complaintantAddress,
      complaintant_accepted: complaint.complaintantAccepted,
      action_taken: complaint.actionTaken,
      complaintant_notified: complaint.complaintantNotified,
      notification_method: complaint.notificationMethod,
      closing_date: complaint.closingDate.toISOString(),
      claim_category: complaint.claimCategory,
      other_claim_category: complaint.otherClaimCategory,
      inspection_date: complaint.inspectionDate.toISOString(),
      collected_information: complaint.collectedInformation,
      resolution_type: complaint.resolutionType,
      resolution_date: complaint.resolutionDate.toISOString(),
      resolution_submitted: complaint.resolutionSubmitted,
      corrective_action_taken: complaint.correctiveActionTaken,
      involved_in_resolution: complaint.involvedInResolution,
      complaintant_satisfaction: complaint.complaintantSatisfaction,
      photos_and_documents_proving_closure:
        complaint.photosAndDocumentsProvingClosure.map((doc) => ({
          id: doc.id,
          photo: doc.photo,
          document: doc.document,
          createdBy: doc.createdBy,
          created_at: doc.createdAt.toISOString(),
          updated_at: doc.updatedAt.toISOString(),
        })),
      resources_spent: Number(complaint.resourcesSpent),
      number_of_days_since_received_to_closure:
        complaint.numberOfDaysSinceReceivedToClosure,
      monitoring_after_closure: complaint.monitoringAfterClosure,
      monitoring_method_and_frequency: complaint.monitoringMethodAndFrequency,
      follow_up: complaint.followUp,
      involved_institutions: complaint.involvedInstitutions,
      suggested_preventive_actions: complaint.suggestedPreventiveActions,
      created_at: complaint.createdAt.toISOString(),
      updated_at: complaint.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedComplaint, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint and claim record:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint and claim record' },
      { status: 500 }
    );
  }
}
