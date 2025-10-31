CREATE TABLE `analysis_results` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`evidence_id` text,
	`module_type` text NOT NULL,
	`analysis_type` text NOT NULL,
	`results` text NOT NULL,
	`confidence` integer,
	`flagged` integer DEFAULT false,
	`analyzed_by` text NOT NULL,
	`analyzed_at` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`evidence_id`) REFERENCES `evidence`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`analyzed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`resource_type` text,
	`resource_id` text,
	`details` text,
	`ip_address` text,
	`user_agent` text,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_logs_user` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_logs_timestamp` ON `audit_logs` (`timestamp`);--> statement-breakpoint
CREATE TABLE `cases` (
	`id` text PRIMARY KEY NOT NULL,
	`case_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`assigned_to_id` text,
	`created_by_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`assigned_to_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cases_case_number_unique` ON `cases` (`case_number`);--> statement-breakpoint
CREATE TABLE `chain_of_custody` (
	`id` text PRIMARY KEY NOT NULL,
	`evidence_id` text NOT NULL,
	`action` text NOT NULL,
	`user_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`location` text,
	`notes` text,
	`ip_address` text,
	FOREIGN KEY (`evidence_id`) REFERENCES `evidence`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`evidence_number` text NOT NULL,
	`type` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer,
	`file_path` text,
	`sha256_hash` text NOT NULL,
	`description` text,
	`collected_by` text NOT NULL,
	`collected_at` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`collected_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` text PRIMARY KEY NOT NULL,
	`sess` text NOT NULL,
	`expire` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `IDX_session_expire` ON `sessions` (`expire`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`profile_image_url` text,
	`role` text DEFAULT 'analyst' NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);