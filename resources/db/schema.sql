CREATE TABLE users (  
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    balance int DEFAULT 0 NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid)
);

CREATE TABLE domains (  
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    domain text NOT NULL,
    balance int DEFAULT 0 NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT
);

CREATE TABLE blocked_domains (  
    user_id UUID NOT NULL,
    domain_id UUID NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, domain_id),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT,
    FOREIGN KEY (domain_id) REFERENCES domains (uuid) ON DELETE CASCADE
);

CREATE TABLE payouts (
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    amount_nils int NOT NULL,
    amount_fiat int NOT NULL,
    currency text NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT
);

CREATE TABLE transactions (
    uuid UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    domain_id UUID NOT NULL,
    amount_nils int NOT NULL,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (uuid),
    FOREIGN KEY (user_id) REFERENCES users (uuid) ON DELETE RESTRICT,
    FOREIGN KEY (domain_id) REFERENCES domains (uuid) ON DELETE CASCADE
);