-- Tạo tài khoản super admin
INSERT INTO
    "users" (
        "publicId",
        "email",
        "fullName",
        "role",
        "status",
        "createdAt",
        "updatedAt"
    )
VALUES (
        '00000000-0000-0000-0000-000000000001',
        'chulinh2006@gmail.com',
        'Super Admin',
        'ADMIN',
        'ACTIVE',
        NOW(),
        NOW()
    ) ON CONFLICT ("email") DO NOTHING;

-- Kiểm tra tài khoản đã được tạo
SELECT "id", "publicId", "email", "fullName", "role", "status"
FROM "users"
WHERE
    "email" = 'admin@miraichay.com';