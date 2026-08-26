#!/bin/bash
find src/components/web -type f -name "*.tsx" -exec sed -i \
  -e 's/gap-6 sm:p-8/gap-8/g' \
  -e 's/to-6 sm:p-8/top-8/g' \
  -e 's/grou6 sm:p-8/group-8/g' \
  {} +
