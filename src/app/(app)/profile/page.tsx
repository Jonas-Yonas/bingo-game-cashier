"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const PROFILE_ICONS = {
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  dollar:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
};

const ACTIVITY_ICONS = {
  ticket:
    "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  "user-plus":
    "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  dollar:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

function ProfileDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof PROFILE_ICONS;
}) {
  return (
    <div className="mb-4 sm:mb-0">
      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={PROFILE_ICONS[icon]}
          />
        </svg>
        {label}
      </p>
      <p className="text-gray-800 dark:text-white font-medium mt-1 truncate">
        {value}
      </p>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
  amount,
}: {
  icon: keyof typeof ACTIVITY_ICONS;
  title: string;
  description: string;
  time: string;
  amount?: string;
}) {
  return (
    <div className="flex items-start">
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3 flex-shrink-0">
        <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={ACTIVITY_ICONS[icon]}
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 dark:text-white truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{time}</p>
      </div>
      {amount && (
        <div
          className={`font-medium ml-2 whitespace-nowrap ${
            amount.startsWith("+")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {amount}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const user = {
    name: session?.user?.name || "Cashier",
    email: session?.user?.email || "cashier@example.com",
    role: "Cashier",
    joinDate: "January 15, 2023",
    lastLogin: new Date().toLocaleString(),
    totalTransactions: 1248,
    performanceRating: "4.8/5.0",
    avatar: session?.user?.image || null,
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-2 sm:px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            User Profile
          </h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base">
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Avatar Section */}
            <div className="p-4 sm:p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <div className="relative mb-3 sm:mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 sm:border-4 border-blue-100 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 sm:border-4 border-blue-100 dark:border-gray-600 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-1 sm:right-2 bg-green-500 rounded-full w-3 h-3 sm:w-4 sm:h-4 border-2 border-white dark:border-gray-800"></div>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white text-center">
                {user.name}
              </h2>
              <p className="text-blue-500 dark:text-blue-400 font-medium text-sm sm:text-base">
                {user.role}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 text-center">
                Member since {user.joinDate}
              </p>
            </div>

            {/* Details Section */}
            <div className="p-4 sm:p-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <ProfileDetail label="Email" value={user.email} icon="mail" />
                <ProfileDetail
                  label="Last Login"
                  value={user.lastLogin}
                  icon="clock"
                />
                <ProfileDetail
                  label="Total Transactions"
                  value={user.totalTransactions.toLocaleString()}
                  icon="dollar"
                />
                <ProfileDetail
                  label="Performance Rating"
                  value={user.performanceRating}
                  icon="star"
                />

                {/* Security Section */}
                <div className="sm:col-span-2 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Security
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex items-center justify-center text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-colors">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                      Change Password
                    </button>
                    <button className="flex items-center justify-center text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-colors">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Two-Factor Auth
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Recent Activity
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <ActivityItem
              icon="ticket"
              title="Processed withdrawal"
              description="Withdrawal ID #WDL-2023-0456"
              time="2 minutes ago"
              amount="-$500.00"
            />
            <ActivityItem
              icon="user-plus"
              title="New player registered"
              description="Player: john_doe"
              time="15 minutes ago"
            />
            <ActivityItem
              icon="dollar"
              title="Deposit processed"
              description="Deposit ID #DEP-2023-7890"
              time="1 hour ago"
              amount="+$1,200.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
