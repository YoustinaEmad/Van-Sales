export class RoleViewModel {
    sectionName: string;
    features: RoleActiveFeatuers[];
}
export class RoleActiveFeatuers {
    featureId: number;
    featureName: string;
    isActiveToRole: boolean;
}
export class assginFeaturesViewModel {
    feature: number;
    roleId: number;
}
export class BulkAssginFeaturesViewModel {
    RoleId: number;
    Features: number[];
}

export class featureSearchViewModel {
    FeatureName: string;
}


