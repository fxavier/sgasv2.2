import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific preliminary form by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const preliminaryForm =
      await db.preliminaryEnvironmentalInformation.findUnique({
        where: {
          id,
        },
      });

    if (!preliminaryForm) {
      return NextResponse.json(
        { error: 'Preliminary form not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedForm = {
      id: preliminaryForm.id,
      activity_name: preliminaryForm.activity_name,
      activity_type: preliminaryForm.activity_type,
      other_activity_type: preliminaryForm.other_activity_type,
      development_stage: preliminaryForm.development_stage,
      other_development_stage: preliminaryForm.other_development_stage,
      proponents: preliminaryForm.proponents,
      address: preliminaryForm.address,
      telephone: preliminaryForm.telephone,
      fax: preliminaryForm.fax,
      mobile_phone: preliminaryForm.mobile_phone,
      email: preliminaryForm.email,
      activity_location: preliminaryForm.activity_location,
      activity_city: preliminaryForm.activity_city,
      activity_locality: preliminaryForm.activity_locality,
      activity_district: preliminaryForm.activity_district,
      activity_province: preliminaryForm.activity_province,
      geographic_coordinates: preliminaryForm.geographic_coordinates,
      insertion_point: preliminaryForm.insertion_point,
      territorial_planning_framework:
        preliminaryForm.territorial_planning_framework,
      activity_infrastructure: preliminaryForm.activity_infrastructure,
      associated_activities: preliminaryForm.associated_activities,
      construction_operation_technology_description:
        preliminaryForm.construction_operation_technology_description,
      main_complementary_activities:
        preliminaryForm.main_complementary_activities,
      labor_type_quantity_origin: preliminaryForm.labor_type_quantity_origin,
      raw_materials_type_quantity_origin_and_provenance:
        preliminaryForm.raw_materials_type_quantity_origin_and_provenance,
      chemicals_used: preliminaryForm.chemicals_used,
      type_origin_water_energy_consumption:
        preliminaryForm.type_origin_water_energy_consumption,
      fuels_lubricants_origin: preliminaryForm.fuels_lubricants_origin,
      other_resources_needed: preliminaryForm.other_resources_needed,
      land_ownership: preliminaryForm.land_ownership,
      activity_location_alternatives:
        preliminaryForm.activity_location_alternatives,
      brief_description_on_local_regional_ref_env_situation:
        preliminaryForm.brief_description_on_local_regional_ref_env_situation,
      physical_characteristics_of_activity_site:
        preliminaryForm.physical_characteristics_of_activity_site,
      predominant_ecosystems: preliminaryForm.predominant_ecosystems,
      location_zone: preliminaryForm.location_zone,
      type_predominant_vegetation: preliminaryForm.type_predominant_vegetation,
      land_use: preliminaryForm.land_use,
      existing_infrastructure_around_activity_area:
        preliminaryForm.existing_infrastructure_around_activity_area,
      total_investment_value: preliminaryForm.total_investment_value
        ? parseFloat(preliminaryForm.total_investment_value.toString())
        : undefined,
      created_at: preliminaryForm.created_at.toISOString(),
      updated_at: preliminaryForm.updated_at.toISOString(),
    };

    return NextResponse.json(formattedForm);
  } catch (error) {
    console.error('Error fetching preliminary form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preliminary form' },
      { status: 500 }
    );
  }
}

// PUT update a preliminary form
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Validate required fields
    if (
      !body.activity_name ||
      !body.address ||
      !body.email ||
      !body.activity_location ||
      !body.activity_city
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the form exists
    const existingForm =
      await db.preliminaryEnvironmentalInformation.findUnique({
        where: {
          id,
        },
      });

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Preliminary form not found' },
        { status: 404 }
      );
    }

    // Update the form
    const preliminaryForm = await db.preliminaryEnvironmentalInformation.update(
      {
        where: {
          id,
        },
        data: {
          activity_name: body.activity_name,
          activity_type: body.activity_type,
          other_activity_type: body.other_activity_type,
          development_stage: body.development_stage,
          other_development_stage: body.other_development_stage,
          proponents: body.proponents,
          address: body.address,
          telephone: body.telephone,
          fax: body.fax,
          mobile_phone: body.mobile_phone,
          email: body.email,
          activity_location: body.activity_location,
          activity_city: body.activity_city,
          activity_locality: body.activity_locality,
          activity_district: body.activity_district,
          activity_province: body.activity_province,
          geographic_coordinates: body.geographic_coordinates,
          insertion_point: body.insertion_point,
          territorial_planning_framework: body.territorial_planning_framework,
          activity_infrastructure: body.activity_infrastructure,
          associated_activities: body.associated_activities,
          construction_operation_technology_description:
            body.construction_operation_technology_description,
          main_complementary_activities: body.main_complementary_activities,
          labor_type_quantity_origin: body.labor_type_quantity_origin,
          raw_materials_type_quantity_origin_and_provenance:
            body.raw_materials_type_quantity_origin_and_provenance,
          chemicals_used: body.chemicals_used,
          type_origin_water_energy_consumption:
            body.type_origin_water_energy_consumption,
          fuels_lubricants_origin: body.fuels_lubricants_origin,
          other_resources_needed: body.other_resources_needed,
          land_ownership: body.land_ownership,
          activity_location_alternatives: body.activity_location_alternatives,
          brief_description_on_local_regional_ref_env_situation:
            body.brief_description_on_local_regional_ref_env_situation,
          physical_characteristics_of_activity_site:
            body.physical_characteristics_of_activity_site,
          predominant_ecosystems: body.predominant_ecosystems,
          location_zone: body.location_zone,
          type_predominant_vegetation: body.type_predominant_vegetation,
          land_use: body.land_use,
          existing_infrastructure_around_activity_area:
            body.existing_infrastructure_around_activity_area,
          total_investment_value: body.total_investment_value,
        },
      }
    );

    // Format the response to match frontend expectations
    const formattedForm = {
      id: preliminaryForm.id,
      activity_name: preliminaryForm.activity_name,
      activity_type: preliminaryForm.activity_type,
      other_activity_type: preliminaryForm.other_activity_type,
      development_stage: preliminaryForm.development_stage,
      other_development_stage: preliminaryForm.other_development_stage,
      proponents: preliminaryForm.proponents,
      address: preliminaryForm.address,
      telephone: preliminaryForm.telephone,
      fax: preliminaryForm.fax,
      mobile_phone: preliminaryForm.mobile_phone,
      email: preliminaryForm.email,
      activity_location: preliminaryForm.activity_location,
      activity_city: preliminaryForm.activity_city,
      activity_locality: preliminaryForm.activity_locality,
      activity_district: preliminaryForm.activity_district,
      activity_province: preliminaryForm.activity_province,
      geographic_coordinates: preliminaryForm.geographic_coordinates,
      insertion_point: preliminaryForm.insertion_point,
      territorial_planning_framework:
        preliminaryForm.territorial_planning_framework,
      activity_infrastructure: preliminaryForm.activity_infrastructure,
      associated_activities: preliminaryForm.associated_activities,
      construction_operation_technology_description:
        preliminaryForm.construction_operation_technology_description,
      main_complementary_activities:
        preliminaryForm.main_complementary_activities,
      labor_type_quantity_origin: preliminaryForm.labor_type_quantity_origin,
      raw_materials_type_quantity_origin_and_provenance:
        preliminaryForm.raw_materials_type_quantity_origin_and_provenance,
      chemicals_used: preliminaryForm.chemicals_used,
      type_origin_water_energy_consumption:
        preliminaryForm.type_origin_water_energy_consumption,
      fuels_lubricants_origin: preliminaryForm.fuels_lubricants_origin,
      other_resources_needed: preliminaryForm.other_resources_needed,
      land_ownership: preliminaryForm.land_ownership,
      activity_location_alternatives:
        preliminaryForm.activity_location_alternatives,
      brief_description_on_local_regional_ref_env_situation:
        preliminaryForm.brief_description_on_local_regional_ref_env_situation,
      physical_characteristics_of_activity_site:
        preliminaryForm.physical_characteristics_of_activity_site,
      predominant_ecosystems: preliminaryForm.predominant_ecosystems,
      location_zone: preliminaryForm.location_zone,
      type_predominant_vegetation: preliminaryForm.type_predominant_vegetation,
      land_use: preliminaryForm.land_use,
      existing_infrastructure_around_activity_area:
        preliminaryForm.existing_infrastructure_around_activity_area,
      total_investment_value: preliminaryForm.total_investment_value
        ? parseFloat(preliminaryForm.total_investment_value.toString())
        : undefined,
      created_at: preliminaryForm.created_at.toISOString(),
      updated_at: preliminaryForm.updated_at.toISOString(),
    };

    return NextResponse.json(formattedForm);
  } catch (error) {
    console.error('Error updating preliminary form:', error);
    return NextResponse.json(
      { error: 'Failed to update preliminary form' },
      { status: 500 }
    );
  }
}

// DELETE a preliminary form
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the form exists
    const existingForm =
      await db.preliminaryEnvironmentalInformation.findUnique({
        where: {
          id,
        },
      });

    if (!existingForm) {
      return NextResponse.json(
        { error: 'Preliminary form not found' },
        { status: 404 }
      );
    }

    // Delete the form
    await db.preliminaryEnvironmentalInformation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting preliminary form:', error);
    return NextResponse.json(
      { error: 'Failed to delete preliminary form' },
      { status: 500 }
    );
  }
}
