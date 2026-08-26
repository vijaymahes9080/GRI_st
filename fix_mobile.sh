#!/bin/bash
find src/components/web -type f -name "*.tsx" -exec sed -i \
  -e 's/text-5xl sm:text-7xl/text-4xl sm:text-6xl lg:text-7xl/g' \
  -e 's/text-4xl sm:text-5xl/text-3xl sm:text-4xl lg:text-5xl/g' \
  -e 's/p-8 sm:p-12/p-6 sm:p-8 lg:p-12/g' \
  -e 's/p-8/p-6 sm:p-8/g' \
  -e 's/p-6 sm:p-8/p-6 sm:p-8/g' \
  -e 's/rounded-\[2rem\]/rounded-3xl sm:rounded-\[2rem\]/g' \
  -e 's/space-y-12/space-y-8 sm:space-y-12/g' \
  -e 's/gap-12/gap-6 sm:gap-8 lg:gap-12/g' \
  -e 's/max-w-6xl mx-auto/max-w-6xl mx-auto px-4 sm:px-6/g' \
  -e 's/max-w-7xl mx-auto/max-w-7xl mx-auto px-4 sm:px-6/g' \
  -e 's/max-w-5xl mx-auto/max-w-5xl mx-auto px-4 sm:px-6/g' \
  -e 's/grid-cols-1 md:grid-cols-3/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/g' \
  -e 's/p-10/p-6 sm:p-10/g' \
  -e 's/h-96/h-64 sm:h-96/g' \
  {} +

# Avoid duplicate p-6 sm:p-8 from simple p-8 replacements that matched already modified ones
# (The sed commands are processed sequentially on each line. So `p-8 sm:p-12` becomes `p-6 sm:p-8 lg:p-12`.
# Then `p-8` matches inside `p-6 sm:p-8 lg:p-12` -> `p-6 sm:p-6 sm:p-8 lg:p-12`, which is bad.

# Let's fix that with perl instead which is better for this.
