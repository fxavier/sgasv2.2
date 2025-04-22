-- CreateTable
CREATE TABLE "preliminary_environmental_information" (
    "id" TEXT NOT NULL,
    "activity_name" TEXT NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "other_activity_type" TEXT,
    "development_stage" "DevelopmentStage" NOT NULL,
    "other_development_stage" TEXT,
    "proponents" TEXT,
    "address" TEXT NOT NULL,
    "telephone" TEXT,
    "fax" TEXT,
    "mobile_phone" TEXT,
    "email" TEXT NOT NULL,
    "activity_location" TEXT NOT NULL,
    "activity_city" TEXT NOT NULL,
    "activity_locality" TEXT,
    "activity_district" TEXT,
    "activity_province" "Provinces" NOT NULL,
    "geographic_coordinates" TEXT,
    "insertion_point" "InsertionPoint" NOT NULL,
    "territorial_planning_framework" "TerritorialPlanningFramework" NOT NULL,
    "activity_infrastructure" TEXT,
    "associated_activities" TEXT,
    "construction_operation_technology_description" TEXT,
    "main_complementary_activities" TEXT,
    "labor_type_quantity_origin" TEXT,
    "raw_materials_type_quantity_origin_and_provenance" TEXT,
    "chemicals_used" TEXT,
    "type_origin_water_energy_consumption" TEXT,
    "fuels_lubricants_origin" TEXT,
    "other_resources_needed" TEXT,
    "land_ownership" TEXT,
    "activity_location_alternatives" TEXT,
    "brief_description_on_local_regional_ref_env_situation" TEXT,
    "physical_characteristics_of_activity_site" "PyhsicalCharacteristics",
    "predominant_ecosystems" "PredominantEcosystems",
    "location_zone" "LocationZone",
    "type_predominant_vegetation" "TypeOfPredominantVegetation",
    "land_use" "LandUse",
    "existing_infrastructure_around_activity_area" TEXT,
    "total_investment_value" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preliminary_environmental_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embedded_mitigation" (
    "id" TEXT NOT NULL,
    "item_number" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "potential_impact_managed" TEXT NOT NULL,
    "mitigation_measure" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "responsibility_for_implementation" TEXT NOT NULL,
    "means_of_verification" TEXT NOT NULL,

    CONSTRAINT "embedded_mitigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_or_construction_phase" (
    "id" TEXT NOT NULL,
    "item_number" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "potential_impact_managed" TEXT NOT NULL,
    "mitigation_measure" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "responsibility_for_implementation" TEXT NOT NULL,
    "means_of_verification" TEXT NOT NULL,

    CONSTRAINT "planning_or_construction_phase_pkey" PRIMARY KEY ("id")
);
