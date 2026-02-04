export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly CUSTOMER: "CUSTOMER";
    readonly SELLER: "SELLER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const UserStatus: {
    readonly BAN: "BAN";
    readonly UNBAN: "UNBAN";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const OrderStatus: {
    readonly PLACED: "PLACED";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
//# sourceMappingURL=enums.d.ts.map