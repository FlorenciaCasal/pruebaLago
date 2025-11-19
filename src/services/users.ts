// Tipos que refleja tu backend (UserResponse / CreateUserRequest / UpdateUserRequest)
export type UserDTO = {
    id: string;                // UUID (UserResponse)
    firstName: string;
    lastName: string;
    email: string;
    // role: "ADMIN" | "MANAGER" | "USER";
    role: "ADMIN" | "MANAGER";
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

// Para mostrar en UI, si te gusta seguir trabajando con "name", creamos un tipo “adaptado”
export type User = {
    id: string;
    name: string;              // firstName + " " + lastName
    email: string;
    // role: "ADMIN" | "MANAGER" | "USER";
    role: "ADMIN" | "MANAGER";
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateUserRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // role?: "ADMIN" | "MANAGER" | "USER";   // si no lo mandás, el backend puede defaultear a USER
    role?: "ADMIN" | "MANAGER";
};

export type UpdateUserRequest = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // role: "ADMIN" | "MANAGER" | "USER";
    role: "ADMIN" | "MANAGER";
    enabled: boolean;
}>;

// Helpers de mapeo entre DTO y el tipo que usa tu UI
function toUser(u: UserDTO): User {
    return {
        id: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(" "),
        email: u.email,
        role: u.role,
        enabled: u.enabled,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
    };
}

function jsonHeaders() {
    return { "content-type": "application/json" };
}

export async function listUsers(): Promise<User[]> {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (!res.ok) throw new Error("Error listando usuarios");
    const data = (await res.json()) as UserDTO[];
    return data.map(toUser);
}

export class ApiError extends Error {
    code: "EMAIL_EXISTS" | "CREATE_FAILED" | "UPDATE_FAILED" | "DELETE_FAILED";
    status?: number;
    constructor(code: ApiError["code"], message?: string, status?: number) {
        super(message ?? code);
        this.code = code;
        this.status = status;
    }
}

export async function createUser(data: CreateUserRequest): Promise<User> {
    const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
    });
    // if (res.status === 409) throw new ApiError("EMAIL_EXISTS", "Email duplicado", 409);
    if (res.status === 400) throw new ApiError("EMAIL_EXISTS", "Email duplicado", 400);
    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new ApiError("CREATE_FAILED", msg || "Create failed", res.status);
    }

    const dto = (await res.json()) as UserDTO;
    return toUser(dto);
}

export async function updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("UPDATE_FAILED");
    const dto = (await res.json()) as UserDTO;
    return toUser(dto);
}

export async function deleteUser(userId: string): Promise<void> {
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("DELETE_FAILED");
}


