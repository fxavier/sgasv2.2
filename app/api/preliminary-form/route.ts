import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all preliminary forms
export async function GET() {
  try {
    const preliminaryForms =
      await db.preliminaryEnvironmentalInformation.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });

    // Format the response to match frontend expectations
    const formattedForms = preliminaryForms.map((form) => ({
      id: form.id,
      activity_name: form.activity_name,
      activity_type: form.activity_type,
      other_activity_type: form.other_activity_type,
      development_stage: form.development_stage,
      other_development_stage: form.other_development_stage,
      proponents: form.proponents,
      address: form.address,
      telephone: form.telephone,
      fax: form.fax,
      mobile_phone: form.mobile_phone,
      email: form.email,
      activity_location: form.activity_location,
      activity_city: form.activity_city,
      activity_locality: form.activity_locality,
      activity_district: form.activity_district,
      activity_province: form.activity_province,
      geographic_coordinates: form.geographic_coordinates,
      insertion_point: form.insertion_point,
      territorial_planning_framework: form.territorial_planning_framework,
      activity_infrastructure: form.activity_infrastructure,
      associated_activities: form.associated_activities,
      construction_operation_technology_description:
        form.construction_operation_technology_description,
      main_complementary_activities: form.main_complementary_activities,
      labor_type_quantity_origin: form.labor_type_quantity_origin,
      raw_materials_type_quantity_origin_and_provenance:
        form.raw_materials_type_quantity_origin_and_provenance,
      chemicals_used: form.chemicals_used,
      type_origin_water_energy_consumption:
        form.type_origin_water_energy_consumption,
      fuels_lubricants_origin: form.fuels_lubricants_origin,
      other_resources_needed: form.other_resources_needed,
      land_ownership: form.land_ownership,
      activity_location_alternatives: form.activity_location_alternatives,
      brief_description_on_local_regional_ref_env_situation:
        form.brief_description_on_local_regional_ref_env_situation,
      physical_characteristics_of_activity_site:
        form.physical_characteristics_of_activity_site,
      predominant_ecosystems: form.predominant_ecosystems,
      location_zone: form.location_zone,
      type_predominant_vegetation: form.type_predominant_vegetation,
      land_use: form.land_use,
      existing_infrastructure_around_activity_area:
        form.existing_infrastructure_around_activity_area,
      total_investment_value: form.total_investment_value
        ? parseFloat(form.total_investment_value.toString())
        : undefined,
      created_at: form.created_at.toISOString(),
      updated_at: form.updated_at.toISOString(),
    }));

    return NextResponse.json(formattedForms);
  } catch (error) {
    console.error('Error fetching preliminary forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preliminary forms' },
      { status: 500 }
    );
  }
}

// POST create a new preliminary form
export async function POST(request: Request) {
  try {
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

    // Create the preliminary form
    const preliminaryForm = await db.preliminaryEnvironmentalInformation.create(
      {
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

    return NextResponse.json(formattedForm, { status: 201 });
  } catch (error) {
    console.error('Error creating preliminary form:', error);
    return NextResponse.json(
      { error: 'Failed to create preliminary form' },
      { status: 500 }
    );
  }
}
