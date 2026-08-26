#!/bin/bash
find src/components/web -type f -name "*.tsx" -exec sed -i \
  -e 's/p-6 sm:p-6 sm:p-8 lg:p-12/p-6 sm:p-8 lg:p-12/g' \
  -e 's/p-6 sm:p-6 sm:p-8/p-6 sm:p-8/g' \
  {} +
